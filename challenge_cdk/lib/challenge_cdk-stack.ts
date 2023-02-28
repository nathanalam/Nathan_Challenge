import * as cdk from "aws-cdk-lib";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import {
  CloudFrontWebDistribution,
  ViewerCertificate,
} from "aws-cdk-lib/aws-cloudfront";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

interface ChallengeCdkStackProps extends cdk.StackProps {
  domainName: string;
}

export class ChallengeCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: ChallengeCdkStackProps) {
    super(scope, id, props);

    // Create an S3 bucket to store the website files
    const siteBucket = new Bucket(this, "SiteBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new BucketDeployment(this, "DeploySite", {
      sources: [Source.asset("./website-dist")],
      destinationBucket: siteBucket,
    });

    // Generate a random domain name to avoid conflicts
    const domainName = props!!.domainName;
    console.log(`Generating site at "${domainName}"`);

    // Create a Route 53 hosted zone for the domain
    const hostedZone = new HostedZone(this, "MyHostedZone", {
      zoneName: domainName,
    });

    // Create an SSL/TLS certificate for the domain
    const certificateArn = new Certificate(this, `SiteCertificate`, {
      domainName,
      validation: CertificateValidation.fromDns(hostedZone),
    }).certificateArn;

    // Create a CloudFront distribution to serve the website files
    const distribution = new CloudFrontWebDistribution(
      this,
      "SiteDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        viewerCertificate: ViewerCertificate.fromAcmCertificate(
          Certificate.fromCertificateArn(
            this,
            "SiteCertificateArn",
            certificateArn
          ),
          { aliases: [domainName] }
        ),
      }
    );

    // Create an A record in the hosted zone that points to the CloudFront distribution
    new ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      ttl: cdk.Duration.minutes(5) // wait for 5 minutes before creating the A record
    });
  }
}
