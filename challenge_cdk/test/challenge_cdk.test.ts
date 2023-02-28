import * as cdk from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { randomUUID } from "crypto";
import * as ChallengeCdk from "../lib/challenge_cdk-stack";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/challenge_cdk-stack.ts
test("S3 Bucket Created", () => {
  const app = new cdk.App();
  const stack = new ChallengeCdk.ChallengeCdkStack(app, "MyTestStack", {
    env: {
      region: "us-east-1",
    },
  });
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::S3::Bucket", {
    WebsiteConfiguration: {
      IndexDocument: "index.html",
    },
  });
});

test("Hosted Zone Created", () => {
  const app = new cdk.App();
  const stack = new ChallengeCdk.ChallengeCdkStack(app, "MyTestStack", {
    env: {
      region: "us-east-1",
    },
  });
  const template = Template.fromStack(stack);

  template.hasResource("AWS::Route53::HostedZone", {});
  template.hasResourceProperties("AWS::Route53::HostedZone", {
    Name: Match.stringLikeRegexp(
      `www.challenge-site-(.){${randomUUID().length}}.com`
    ),
  });
});
