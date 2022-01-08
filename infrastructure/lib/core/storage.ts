import * as cdk from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'

export class AssetStorage extends cdk.Construct {
  public readonly hostingBucket: s3.IBucket

  public readonly assetBucket: s3.IBucket

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)

    this.hostingBucket = new s3.Bucket(this, 'WebHostingBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
    })
  }
}
