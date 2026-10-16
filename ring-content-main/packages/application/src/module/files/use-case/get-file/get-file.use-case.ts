import { IUseCase, logger } from "@egc-io/ckit-lib";
import {
	FILE_REPOSITORY, FileEntity, IFileRepository, InternalServerErrorException, IStorageAdapter,
	IStoreRepository, NotFoundError, STORAGE_ADAPTER, STORE_ENTITY_REPOSITORY
} from "@ringcontent/core";
import { join } from "path";

import { autoInjectable, inject } from "tsyringe";

export type GetFileIn = {
	hash: string;
	revision?: number;
};
export type GetFileOut = { buffer: Buffer, meta: FileEntity; };

@autoInjectable()
export class GetFileUseCase implements IUseCase<GetFileIn, GetFileOut> {
	constructor(
		@inject(FILE_REPOSITORY) private _fileRepo: IFileRepository,
		@inject(STORE_ENTITY_REPOSITORY) private _storeRepo: IStoreRepository,
		@inject(STORAGE_ADAPTER) private _storage: IStorageAdapter,
	) { }

	async execute(input: GetFileIn): Promise<GetFileOut> {
		let meta: FileEntity | null;
		try {
			meta = await this._fileRepo.getByFileID(input.hash, input.revision);
		} catch (error) {
			throw new InternalServerErrorException(`cannot fetch file`, {
				input,
			}, error);
		}

		console.log(input, meta)

		if (!meta) {
			throw new NotFoundError('file not found', { input });
		}

		let file_path: string;
		try {
			const store = await this._storeRepo.findById(meta.store_id);
			file_path = join(store.root, `${meta.file_id}_${meta.revision}`);
		} catch (error) {
			throw new InternalServerErrorException(`cannot fetch store`, { meta, input }, error);
		}

		try {
			const buffer = await this._storage.read(file_path);
			return { buffer, meta };
		} catch (error) {
			throw new InternalServerErrorException(`cannot read file`, { file_path, meta, input }, error);
		}
	}
}