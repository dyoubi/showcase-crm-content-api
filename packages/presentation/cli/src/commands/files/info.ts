import { Args, Command, Flags } from '@oclif/core'

export default class FilesInfo extends Command {
  static override args = {
    file_id: Args.string({ description: 'file_id', name: 'id', required: true }),
  }

  static override description = 'describe the command here'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    // flag with no value (-f, --force)
    revision: Flags.integer({ char: 'r', required: false }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(FilesInfo);
  }
}
