import "reflect-metadata"

import { DeleteFileUseCase } from '@ringcontent/application';
import { Args, Command, Flags } from '@oclif/core';
import { context } from '../../common/ioc';

export default class FilesDelete extends Command {
  static override args = {
    file_id: Args.string({ description: 'file to delete', required: true }),
  };

  static override description = 'describe the command here';

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ];

  static override flags = {
    // flag with a value (-f, --flag=VALUE)
    // flag: Flags.string({char: 'f', description: ''}),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(FilesDelete);

    const ioc = await context();

    const use = ioc.get<DeleteFileUseCase>(DeleteFileUseCase);

    use.execute({ file_id: args.file_id });
  }
}
