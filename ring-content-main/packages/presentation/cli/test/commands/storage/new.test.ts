import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('storage:new', () => {
  it('runs storage:new cmd', async () => {
    const {stdout} = await runCommand('storage:new')
    expect(stdout).to.contain('hello world')
  })

  it('runs storage:new --name oclif', async () => {
    const {stdout} = await runCommand('storage:new --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
