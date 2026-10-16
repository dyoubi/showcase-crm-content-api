import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('files:info', () => {
  it('runs files:info cmd', async () => {
    const {stdout} = await runCommand('files:info')
    expect(stdout).to.contain('hello world')
  })

  it('runs files:info --name oclif', async () => {
    const {stdout} = await runCommand('files:info --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
