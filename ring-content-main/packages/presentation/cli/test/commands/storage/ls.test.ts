import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('storage:ls', () => {
  it('runs storage:ls cmd', async () => {
    const {stdout} = await runCommand('storage:ls')
    expect(stdout).to.contain('hello world')
  })

  it('runs storage:ls --name oclif', async () => {
    const {stdout} = await runCommand('storage:ls --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
