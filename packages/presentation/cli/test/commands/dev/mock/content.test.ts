import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('dev:mock:content', () => {
  it('runs dev:mock:content cmd', async () => {
    const {stdout} = await runCommand('dev:mock:content')
    expect(stdout).to.contain('hello world')
  })

  it('runs dev:mock:content --name oclif', async () => {
    const {stdout} = await runCommand('dev:mock:content --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
