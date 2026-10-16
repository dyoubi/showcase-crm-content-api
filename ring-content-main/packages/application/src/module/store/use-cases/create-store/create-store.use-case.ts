import { IUseCase, logger } from "@egc-io/ckit-lib";
import {
	InternalServerErrorException,
	IStorageAdapter, IStoreRepository, STORAGE_ADAPTER,
	STORAGE_ROOT_PATH,
	STORE_ENTITY_REPOSITORY, StoreDirectoryName, StoreEntity
} from "@ringcontent/core";
import { UUID } from "crypto";
import { autoInjectable, inject } from "tsyringe";

export type CreateStoreIn = {
	org_id: UUID;
	operator_id: UUID;
	name: string;
};

export type CreateStoreOut = StoreEntity;

@autoInjectable()
export class CreateStoreUseCase implements IUseCase<CreateStoreIn, CreateStoreOut> {
	constructor(
		@inject(STORAGE_ADAPTER) private _storage: IStorageAdapter,
		@inject(STORE_ENTITY_REPOSITORY) private _storeRepo: IStoreRepository,
	) { }

	async execute(input: CreateStoreIn): Promise<CreateStoreOut> {
		let store: StoreEntity | null = new StoreEntity();
		let root: string = `${StoreDirectoryName(input)}`;
		console.log(root);
		try {
			store = await this._storeRepo.create({ root, ...input });
		} catch (error) {
			throw new InternalServerErrorException(`cannot create store`, undefined, error);
		}

		try {
			await this._storage.mkdir(root);
		} catch (error) {
			logger.error(error);
			try {
				this._storeRepo.deleteById(store.id);
			} catch (err) {
				logger.error(err);
				throw new InternalServerErrorException(`fatal cannot handle error correctly`, error, err);
			}
			throw new InternalServerErrorException(`cannot create directory`, undefined, error);
		}
		return store;
	}
}