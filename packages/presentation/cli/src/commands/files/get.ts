import { Args, Command, Flags } from '@oclif/core'

export default class FilesGet extends Command {
  static override args = {
    file_id: Args.string({ description: 'file_id', required: true }),
  }

  static override description = 'describe the command here'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {}

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(FilesGet);
  }
}
