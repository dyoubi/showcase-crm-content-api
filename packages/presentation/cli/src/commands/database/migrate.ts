import { Args, Command, Flags } from '@oclif/core'
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { parseEnv } from 'util';
import { context } from '../../common/ioc';
import { DataSource, DATASOURCE } from '@ringcontent/database';

export default class DatabaseMigrate extends Command {
  static override args = {};

  static override description = 'run database migration'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    env: Flags.string({ name: 'env' }),
    dry: Flags.boolean({ name: 'dry' }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(DatabaseMigrate);
    const dryMode = flags.dry ?? false;

    if (dryMode) {
      this.log('running dry mode. No changes');
    }

    if (flags.env) {
      const envPath = join(cwd(), flags.env ?? './');
      this.log(`read env ${envPath}\n`);
      if (!execSync(envPath)) {
        this.error('env file not found');
      }
      parseEnv(readFileSync(envPath, 'utf-8'));
    }

    const ctx = context();
    const ds = ctx.get<DataSource>(DATASOURCE);

    try {
      await ds.runMigrations({
        fake: dryMode,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unkown reason';
      this.error(`migration failure:\n${message}`);
    }
  }
}
