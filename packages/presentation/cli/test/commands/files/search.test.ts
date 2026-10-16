import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('files:search', () => {
  it('runs files:search cmd', async () => {
    const {stdout} = await runCommand('files:search')
    expect(stdout).to.contain('hello world')
  })

  it('runs files:search --name oclif', async () => {
    const {stdout} = await runCommand('files:search --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
