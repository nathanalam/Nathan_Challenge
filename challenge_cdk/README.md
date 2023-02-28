# Static Site Hosting Challenge

This is a Typescript CDK project that will deploy the assets in the `website-dist` folder into an S3 bucket and set it up for public hosting through an SSL securitized FQDN.

To deploy this in your AWS account, do the following:

1. Purchase a valid domain name from a DNS provider
2. Configure AWS
 Run the following command (assuming you have the AWS CLI installed)
 ```
 aws configure
 ```
 Then, provide an Access Key ID, Secret Access Key, and default region to deploy to

3. Deploy CDK
 Run the following:
 ```
 npm install
 npx cdk bootstrap
 export CDK_DOMAIN_NAME="<your_domain_name_here>"
 npx cdk deploy
 ```
4. The stack will pause until the domain name is configured to use the route 53 hosted zone's name servers. You will now need to go to the AWS console, find the hosted zone, and copy the name servers to the desired domain name.

5. Wait for ACM to verify DNS ownership after the domain name is configured to work with Route53's hosted zone.


### References
* https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html
