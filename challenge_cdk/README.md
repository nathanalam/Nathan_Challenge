# Static SIte Hosting Challenge

This is a Typescript CDK project that will deploy the assets in the `website-dist` folder into an S3 bucket and set it up for public hosting through an SSL securitized FQDN.

To deploy this in your AWS account, do the following:

1. Configure AWS
 Run the following command (assuming you have the AWS CLI installed)
 ```
 aws configure
 ```
 Then, provide an Access Key ID, Secret Access Key, and default region to deploy to
2. Deploy CDK
 Run the following:
 ```
 npm install
 npx cdk bootstrap
 npx cdk deploy
 ```
3. Wait for ACM to verify DNS ownership (can take up to 72 hours, but usually within an hour)


### References
* https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html