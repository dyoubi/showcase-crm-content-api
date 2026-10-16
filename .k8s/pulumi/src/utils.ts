import * as https from 'https'

import * as pulumi from '@pulumi/pulumi'

export const allowAllRule = [{
    fromPort: 0,
    toPort: 0,
    protocol: '-1',
    cidrBlocks: ['0.0.0.0/0'],
    ipv6CidrBlocks: ['::/0'],
}]

const fetchUrl = (url: string): pulumi.Output<string> => pulumi.output(new Promise<string>((resolve, reject) => {
    https.get(url, resp => {
        let buffer = ''
        resp.on('data', (ip: Buffer) => {
            buffer += ip.toString()
        })
        resp.on('end', () => {
            resolve(buffer)
        })
        resp.on('error', (err: Error) => {
            reject(err)
        })
    }).on('error', (err: Error) => {
        reject(err)
    })
}))

const getCloudflareIps = (): pulumi.Output<string[]> => fetchUrl('https://www.cloudflare.com/ips-v4').apply(s => s.split('\n').sort())

export const cloudflareIps = getCloudflareIps()
