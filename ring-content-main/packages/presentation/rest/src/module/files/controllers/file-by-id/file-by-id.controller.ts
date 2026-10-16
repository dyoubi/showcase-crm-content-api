import { Ioc } from '@ringcontent/ioc';
import {
	Body, Controller, Get, Inject,
	InternalServerErrorException, Param, Query, StreamableFile
} from '@nestjs/common';
import { IOC } from 'src/common/ioc';

import { GetFileUseCase } from '@ringcontent/application';
import { ApiTags } from '@nestjs/swagger';
import { Exception } from '@ringcontent/core';

@ApiTags('Files', 'Public')
@Controller('file/:file_id')
export class FileByIdController {
	constructor(@Inject(IOC) private _ioc: Ioc,) { }

	@Get()
	async getFile(
		@Param('file_id') file_id: string,
		@Query('revision') revision?: number,
	) {
		try {
			const use = this._ioc.get<GetFileUseCase>(GetFileUseCase);
			const file = await use.execute({ hash: file_id, revision });
			return new StreamableFile(file.buffer, { type: file.meta.mimetype });
		} catch (error) {
			if (error instanceof Exception) {
				throw error;
			} else {
				throw new InternalServerErrorException(error.message);
			}
		}
	}

}
