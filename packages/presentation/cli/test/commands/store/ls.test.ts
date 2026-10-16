import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('store:ls', () => {
  it('runs store:ls cmd', async () => {
    const {stdout} = await runCommand('store:ls')
    expect(stdout).to.contain('hello world')
  })

  it('runs store:ls --name oclif', async () => {
    const {stdout} = await runCommand('store:ls --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
