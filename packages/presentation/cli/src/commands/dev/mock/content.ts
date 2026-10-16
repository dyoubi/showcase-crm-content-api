import sharp = require('sharp');

import { Command, Flags } from '@oclif/core';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { ensureDir } from '../../../common/func';
import { writeFileSync } from 'node:fs';
import { getImgContentList } from '@ringcontent/test';

export default class DevMockContent extends Command {
  static override args = {};

  static override description = 'describe the command here';

  static override examples = [];

  static override flags = {
    output: Flags.directory({ exists: false, default: './.content' }),
    count: Flags.integer({ default: 4, required: false })
  };


  public async run(): Promise<void> {
    const { args, flags } = await this.parse(DevMockContent);
    const outputPath = join(cwd(), flags.output);
    ensureDir((outputPath));
    const count = flags.count;

    const contentList = await getImgContentList(count);

    const form = new FormData();
    for (const content of contentList) {
      console.log(content.fileName);
      const blob = new Blob([content.data], { type: 'image/png' });
      form.append('/', blob, content.fileName);
      //writeFileSync(join(outputPath, content.fileName), content.data);
    }

    const requestOptions = {
      method: "POST",
      body: form,
    };

    try {
      const response = await fetch("http://localhost:3000/stores/72f6cb8b-ab53-48fd-9553-4fbcd186f202/files/upload", requestOptions);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    };

  }
}
