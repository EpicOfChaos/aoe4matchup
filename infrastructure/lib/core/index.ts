import * as cdk from '@aws-cdk/core'
import { WebApp } from './webapp'
import { AssetStorage } from './storage'

export class Aoe4MatchupStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    const storage = new AssetStorage(this, 'Storage')

    const webapp = new WebApp(this, 'WebApp', {
      hostingBucket: storage.hostingBucket,
      baseDirectory: '../',
      relativeWebAppPath: 'webapp',
    })
  }
}
