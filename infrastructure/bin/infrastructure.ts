import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { ApplicationPipelineStack } from '../lib/pipeline'

const app = new cdk.App()
new ApplicationPipelineStack(app, 'AOE4-Matchup-Pipeline')
