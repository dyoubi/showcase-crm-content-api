import * as pulumi from '@pulumi/pulumi'

import { Config, HelmConfig, RdsConfig, Secrets, StackRefs, VpcResult } from './types'

const cfg = new pulumi.Config()
const infraStack = new pulumi.StackReference(cfg.require('infraStack'))

export const config: Config = {
    hostnames: cfg.requireObject<string[]>('hostnames'),
    helm: cfg.requireObject<HelmConfig>('helm'),
    protect: cfg.requireBoolean('protect'),
    rdsParameterGroup: cfg.requireObject('rdsParameterGroup'),
    rds: cfg.requireObject<RdsConfig>('rds'),
}

export const secrets: Secrets = {
    helmEnvVars: cfg.getSecretObject<Record<string, string>>('helmEnvVarsSecret'),
}

export const refs: StackRefs = {
    vpc: infraStack.requireOutput('vpc') as pulumi.Output<VpcResult>,
}
