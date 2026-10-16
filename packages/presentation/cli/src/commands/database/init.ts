import { Args, Command, Flags } from '@oclif/core'
import { context } from '../../common/ioc'
import { DataSource, DATASOURCE } from '@ringcontent/database'

export default class DatabaseInit extends Command {
  static override args = {}

  static override description = 'describe the command here'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]
  
  static override flags = {}
  public async run(): Promise<void> {
    const { args, flags } = await this.parse(DatabaseInit);
  }
}
