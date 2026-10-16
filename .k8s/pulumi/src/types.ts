import * as aws from '@pulumi/aws'
import { input } from '@pulumi/aws/types';
import * as pulumi from '@pulumi/pulumi'

export type StringRecord<T> = Record<string, T>
export interface RdsParameterGoupConfig {
    name: string
    family: string
    parameters: input.rds.ParameterGroupParameter[]
}

export interface RdsConfig {
    identifier: string
    dbSubnetGroupName: string
    instanceClass: aws.rds.InstanceType
    engineVersion: string
    multiAz: boolean
    allocatedStorage: number
    maxAllocatedStorage?: number
    dbName: string
    username: string
    backupWindow?: string
    maintenanceWindow?: string
}

export interface HelmConfig {
    autoscaling?: {
        enabled: boolean
        maxReplicas: bigint
        minReplicas: bigint
    }
    envVars?: Record<string, string>
    fullnameOverride?: string
    ingressClass?: 'alb' | 'nginx'
    namespace: string
    replicaCount?: bigint
}

export interface Config {
    hostnames: string[]
    helm: HelmConfig
    protect: boolean
    rdsParameterGroup: RdsParameterGoupConfig
    rds: RdsConfig
}

export interface Secrets {
    helmEnvVars?: pulumi.Output<Record<string, string>>
}

export interface VpcResult {
    id: string
    azs: string[]
    subnets: Record<string, Record<string, string>>
    rdsGroups: Record<string, string>
}

export interface StackRefs {
    vpc: pulumi.Output<VpcResult>
}
