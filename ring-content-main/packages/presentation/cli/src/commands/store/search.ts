import { Command, Flags } from '@oclif/core';
import { context } from '../../common/ioc';
import { FILE_REPOSITORY, FileHeader, IFileRepository } from '@ringcontent/core';
import { join } from 'path';
import { createInterface } from 'node:readline';

export default class StoreSearch extends Command {
  static override description = 'search files in a store';
  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ];

  static override flags = {
    store: Flags.string({ char: 's', required: false }),
    limit: Flags.integer({ char: 'l' }),
    offset: Flags.integer({ char: 'o' }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(StoreSearch);

    const ioc = await context();
    const files = ioc.get<IFileRepository>(FILE_REPOSITORY);

    let headerList: FileHeader[] = [];
    let store = flags.store;
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    if (!store) {
      store = await new Promise<string>((resolve) => {
        async () => {
          rl.question('store ? ', async (id) => {
            resolve(id);
          });
        };
      });
    }

    rl.prompt(true);
    rl.on('line', async (match) => {
      rl.pause();
      headerList = await files.search(store, {
        limit: flags.limit,
        offset: flags.offset,
        match: match
      });
      console.log(headerList.map(v => `${v.file_id} : ${join(v.store_path, v.file_name)} (${v.mimetype})`).join('\n'));
      rl.resume();
    });
  }
}
