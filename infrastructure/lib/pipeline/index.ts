import * as cdk from '@aws-cdk/core'
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import { GitHubSourceAction } from '@aws-cdk/aws-codepipeline-actions'
import { Aoe4MatchupStack } from '../core'

class AppStage extends cdk.Stage {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props)
    new Aoe4MatchupStack(this, 'AOE4-Matchup')
  }
}

export class ApplicationPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const sourceArtifact = new codepipeline.Artifact()
    const cloudAssemblyArtifact = new codepipeline.Artifact()

    const pipeline = new CdkPipeline(this, 'Pipeline', {
      pipelineName: 'Aoe4MatchupPipeline',
      cloudAssemblyArtifact,
      crossAccountKeys: false,
      sourceAction: new GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: cdk.SecretValue.secretsManager('AOE4_MATCHUP_GITHUB_KEY', {
          jsonField: 'github_token',
        }),
        owner: 'EpicOfChaos',
        repo: 'aoe4matchup',
        branch: 'main',
      }),
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        subdirectory: 'infrastructure',
        installCommand: 'cd .. && yarn install && yarn build && cd infrastructure',
        environment: {
          privileged: true,
        },
      }),
    })

    pipeline.addApplicationStage(new AppStage(this, 'Production'))
  }
}
