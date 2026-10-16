import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('database:init', () => {
  it('runs database:init cmd', async () => {
    const {stdout} = await runCommand('database:init')
    expect(stdout).to.contain('hello world')
  })

  it('runs database:init --name oclif', async () => {
    const {stdout} = await runCommand('database:init --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
