import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as cloudfront from '@aws-cdk/aws-cloudfront'
import { WebAppConfig } from './web-app-config'
import { WebAppDeployment } from './web-app-deployment'

interface WebAppProps {
  hostingBucket: s3.IBucket
  relativeWebAppPath: string
  baseDirectory: string
}

export class WebApp extends cdk.Construct {
  public readonly webDistribution: cloudfront.CloudFrontWebDistribution

  constructor(scope: cdk.Construct, id: string, props: WebAppProps) {
    super(scope, id)

    const oai = new cloudfront.OriginAccessIdentity(this, 'WebHostingOAI', {})

    const cloudfrontProps: any = {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: props.hostingBucket,
            originAccessIdentity: oai,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      errorConfigurations: [
        {
          errorCachingMinTtl: 86400,
          errorCode: 403,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
        {
          errorCachingMinTtl: 86400,
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
    }

    this.webDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'AppHostingDistribution',
      cloudfrontProps,
    )

    props.hostingBucket.grantRead(oai)

    // Deploy Web App ----------------------------------------------------

    const deployment = new WebAppDeployment(this, 'WebAppDeploy', {
      baseDirectory: props.baseDirectory,
      relativeWebAppPath: props.relativeWebAppPath,
      webDistribution: this.webDistribution,
      webDistributionPaths: ['/*'],
      buildCommand: 'yarn build',
      buildDirectory: 'build',
      bucket: props.hostingBucket,
      prune: false,
    })

    new cdk.CfnOutput(this, 'URL', {
      value: `https://${this.webDistribution.distributionDomainName}/`,
    })

    // Web App Config ------------------------------------------------------

    new WebAppConfig(this, 'WebAppConfig', {
      bucket: props.hostingBucket,
      key: 'config.js',
      configData: {
        test: 'test-config',
      },
      globalVariableName: 'appConfig',
    }).node.addDependency(deployment)
  }
}
