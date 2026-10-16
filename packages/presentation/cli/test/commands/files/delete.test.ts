import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('files:delete', () => {
  it('runs files:delete cmd', async () => {
    const {stdout} = await runCommand('files:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs files:delete --name oclif', async () => {
    const {stdout} = await runCommand('files:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
