import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('database:migrate', () => {
  it('runs database:migrate cmd', async () => {
    const {stdout} = await runCommand('database:migrate')
    expect(stdout).to.contain('hello world')
  })

  it('runs database:migrate --name oclif', async () => {
    const {stdout} = await runCommand('database:migrate --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
