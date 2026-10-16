import { Args, Command, Flags } from '@oclif/core'
import { context } from '../../common/ioc'
import { CreateStoreUseCase } from '@ringcontent/application'
import { randomUUID } from 'crypto'
import { versionAddition } from '@oclif/core/lib/main'

export default class StoreNew extends Command {
  static override args = {}

  static override description = 'create a new store for the operator'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    name: Flags.string({ name: 'name', required: true }),
    ['org-id']: Flags.string({ name: 'org-id', required: true }),
    ['operator-id']: Flags.string({ name: 'operator-id', required: true })
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(StoreNew);
    console.log(flags);
    const use = context().get<CreateStoreUseCase>(CreateStoreUseCase);
    const store = await use.execute({
      name: flags.name,
      operator_id: randomUUID(),
      org_id: randomUUID(),
    });

    this.logJson(store);
    this.exit(0);
  }
}
