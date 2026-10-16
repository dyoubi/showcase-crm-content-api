import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('store:delete', () => {
  it('runs store:delete cmd', async () => {
    const {stdout} = await runCommand('store:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs store:delete --name oclif', async () => {
    const {stdout} = await runCommand('store:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
