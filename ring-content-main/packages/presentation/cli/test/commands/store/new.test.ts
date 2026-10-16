import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('store:new', () => {
  it('runs store:new cmd', async () => {
    const {stdout} = await runCommand('store:new')
    expect(stdout).to.contain('hello world')
  })

  it('runs store:new --name oclif', async () => {
    const {stdout} = await runCommand('store:new --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
