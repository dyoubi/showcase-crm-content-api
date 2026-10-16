import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('files:get', () => {
  it('runs files:get cmd', async () => {
    const {stdout} = await runCommand('files:get')
    expect(stdout).to.contain('hello world')
  })

  it('runs files:get --name oclif', async () => {
    const {stdout} = await runCommand('files:get --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
