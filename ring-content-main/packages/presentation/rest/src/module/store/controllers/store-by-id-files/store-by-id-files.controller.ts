import {
	BadRequestException, Body,
	Controller, Delete, Get, Inject,
	Param,
	Patch, Post, Query,
	UploadedFiles, UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { Exception } from '@egc-io/ckit-lib';

import {
	DeleteFileUseCase, UpdateFileUseCase, UploadFileIn,
	UploadFileOut, UploadFileUseCase
} from '@ringcontent/application';

import { FileHeader } from '@ringcontent/core';
import {
	FILE_REPOSITORY, FileMetadata, IFileRepository,
	MakeStorePath, SizeLimit
} from '@ringcontent/core';

import { Ioc } from '@ringcontent/ioc';

import { UUID } from 'crypto';
import { extname, isAbsolute } from 'path';

import { IOC } from 'src/common/ioc';
import { LIMIT_mo } from 'src/common/limit';
import { QueryDTO, QueryPipe as QueryObjectPipe } from 'src/common/query';
import { FileDeleteQueryDTO } from 'src/module/store/dto';

@ApiTags('Store', 'Files', 'Stores')
@Controller('stores/:store_id/files')
export class StoreByIdFilesController {
	constructor(@Inject(IOC) private _ioc: Ioc,) { }

	@Post('upload')
	@UseInterceptors(AnyFilesInterceptor())
	async uploadFile(
		@Param('store_id') store_id: UUID,
		@UploadedFiles() fileList: Array<Express.Multer.File>,
		@Query('update') update?: boolean,
	) {
		update = Boolean(update);
		if (fileList.length < 1) { throw new BadRequestException('no file'); }
		const use = this._ioc.get<UploadFileUseCase>(UploadFileUseCase);
		let metaList: Array<UploadFileIn> = [];
		for (const file of fileList) {
			const store_path = file.fieldname ? MakeStorePath(file.fieldname) : '/';
			const name = file.originalname.substring(0, file.originalname.length - extname(file.originalname).length);
			if (!SizeLimit(file.size, LIMIT_mo)) {
				throw new BadRequestException(`file size exceeds limit (${LIMIT_mo}mo)`);
			}
			if (!isAbsolute(store_path)) {
				throw new BadRequestException('storage path must be abosute');
			}

			metaList.push({
				buffer: file.buffer,
				metadata: {
					file_name: file.originalname,
					mimetype: file.mimetype,
					store_path,
					name,
				},
				store_id,
				update
			});
		}
		const promiseList: Array<Promise<UploadFileOut>> = [];
		for (const input of metaList) {
			promiseList.push(use.execute(input));
		}
		try {
			return await Promise.all(promiseList);
		} catch (error) {
			if (error instanceof Exception) {
				throw error;
			} else {
				throw new BadRequestException(error.message);
			}
		}
	}

	@Get()
	async getFiles(
		@Param('store_id') store_id: string,
		@Query(QueryObjectPipe) query: QueryDTO<FileHeader>) {
		const repo = this._ioc.get<IFileRepository>(FILE_REPOSITORY);
		try {
			const fileList = await repo.find({
				...query,
				where: {
					store_id: { eq: store_id },
					...(query.where ?? {})
				},
			});
			return fileList;
		} catch (error) {
			if (error instanceof Exception) {
				throw error;
			} else {
				throw new BadRequestException(error.message);
			}
		}
	}

	@Patch(':file_id')
	async updateFile(
		@Param('store_id') store_id: UUID,
		@Param('file_id') file_id: string,
		@Body() data: Pick<FileMetadata, 'name' | 'description'>,
	) {
		const use = this._ioc.get<UpdateFileUseCase>(UpdateFileUseCase);
		try {
			const meta = await use.execute({
				data,
				file_id,
			});
			return meta;
		} catch (error) {
			console.log(error);
			if (error instanceof Exception) {
				throw error;
			} else {
				throw new BadRequestException(error.message);
			}
		}
	}

	@Delete()
	async deleteFile(
		@Query() query: FileDeleteQueryDTO
	) {
		if (!Array.isArray(query.id)) { query.id = [query.id]; }
		const use = this._ioc.get<DeleteFileUseCase>(DeleteFileUseCase);
		for (const file_id of query.id) {
			try {
				await use.execute({ file_id });
			} catch (error) {
				if (error instanceof Exception) {
					throw error;
				} else {
					throw new BadRequestException(error.message);
				}
			}
		}
		return true;
	}
}
