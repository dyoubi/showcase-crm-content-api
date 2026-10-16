import { Hook } from '@oclif/core'
import { setup } from '../../common/ioc';

const hook: Hook<'init'> = async function (opts) {
  process.stdout.write(`setup context ${opts.id}\n`);
  await setup();
}

export default hook;
