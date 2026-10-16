/* eslint-disable @typescript-eslint/no-unused-vars */
import assert from 'assert';

import * as aws from '@pulumi/aws';
import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';

import { config, refs, secrets } from './config';
import { allowAllRule, cloudflareIps } from './utils';

const ec2SecurityGroup = new aws.ec2.SecurityGroup('ec2SecurityGroup', {
    name: pulumi.getStack(),
    vpcId: refs.vpc.id,
    egress: allowAllRule,
    ingress: allowAllRule,
    tags: {
        Name: pulumi.getStack(),
    },
});

const rdsPassword = new random.RandomPassword('rdsPassword', {
    length: 32,
    special: false,
});

const rdsParameterGroup = new aws.rds.ParameterGroup('rdsParameterGroup', config.rdsParameterGroup);

const rdsInstance = new aws.rds.Instance('rdsInstance', {
    applyImmediately: true,
    ...config.rds,
    dbSubnetGroupName: refs.vpc.rdsGroups.apply(g => g[config.rds.dbSubnetGroupName]),
    engine: 'postgres',
    allowMajorVersionUpgrade: true,
    autoMinorVersionUpgrade: false,
    iamDatabaseAuthenticationEnabled: true,
    password: rdsPassword.result,
    backupRetentionPeriod: 30,
    copyTagsToSnapshot: true,
    vpcSecurityGroupIds: [ec2SecurityGroup.id],
    storageType: 'gp3',
    deletionProtection: config.protect,
    skipFinalSnapshot: !config.protect,
    parameterGroupName: rdsParameterGroup.name,
}, { protect: config.protect });

const efsFileSystem = new aws.efs.FileSystem('efsFileSystem', {
    tags: {
        Name: pulumi.getStack(),
    },
}, { protect: config.protect });

const efsMountTargets = [...Array(3).keys()].map(i => {
    const az = refs.vpc.azs[i];
    return new aws.efs.MountTarget(`efsMountTarget-${i}`, {
        fileSystemId: efsFileSystem.id,
        subnetId: az.apply(k => refs.vpc.subnets.private[k]),
        securityGroups: [ec2SecurityGroup.id],
    });
});

assert(process.env.REGISTRY_IMAGE, 'REGISTRY_IMAGE environment variable missing');
assert(process.env.IMAGE_TAG, 'IMAGE_TAG environment variable missing');

const helmRelease = new k8s.helm.v3.Release('helmRelease', {
    name: pulumi.getStack(),
    chart: '../helm',
    namespace: config.helm.namespace,
    values: {
        fullnameOverride: config.helm.fullnameOverride,
        image: {
            repository: process.env.REGISTRY_IMAGE,
            tag: process.env.IMAGE_TAG,
        },
        envVars: pulumi.output(config.helm.envVars).apply(vars => ({
            ...vars ?? {},
            PG_HOST: rdsInstance.address,
            PG_PORT: rdsInstance.port.apply(n => n.toString()),
            PG_USER: rdsInstance.username,
            PG_DATABASE: rdsInstance.dbName,
        })),
        envVarsSecret: pulumi.output(secrets.helmEnvVars).apply(vars => ({
            ...vars ?? {},
            PG_PASSWORD: rdsPassword.result,
        })),
        fileSystem: {
            id: efsFileSystem.id,
        },
        replicaCount: config.helm.replicaCount,
        ingress: {
            className: config.helm.ingressClass,
            ...config.helm.ingressClass === 'alb'
                ? {
                    externalDns: true,
                    annotations: {
                        'alb.ingress.kubernetes.io/scheme': 'internet-facing',
                        'alb.ingress.kubernetes.io/target-type': 'instance',
                        'alb.ingress.kubernetes.io/inbound-cidrs': cloudflareIps.apply(b => b.join(', ')),
                        'alb.ingress.kubernetes.io/ssl-policy': 'ELBSecurityPolicy-FS-1-2-Res-2019-08',
                        'alb.ingress.kubernetes.io/ip-address-type': 'ipv4',
                        'alb.ingress.kubernetes.io/listen-ports': '[{"HTTPS":443}]',
                        'alb.ingress.kubernetes.io/healthcheck-path': '/ping',
                    },
                }
                : {},
            hosts: config.hostnames.map(hostname => ({
                host: hostname,
                paths: [{
                    path: '/',
                    pathType: 'Prefix',
                }],
            })),
        },
        ...config.helm.ingressClass === 'alb'
            ? {
                service: {
                    type: 'NodePort',
                },
            }
            : {},
        autoscaling: config.helm.autoscaling,
    },
    atomic: true,
    cleanupOnFail: true,
    createNamespace: true,
    dependencyUpdate: true,
    recreatePods: true,
    waitForJobs: true,
},{
    dependsOn: efsMountTargets,
}
);

export { config } from './config';

export const db = {
    address: rdsInstance.address,
    port: rdsInstance.port,
    username: rdsInstance.username,
    password: rdsPassword.result,
    dbName: rdsInstance.dbName,
};
