import { IUseCase } from "@egc-io/ckit-lib";
import {
    FileMetadata,
    IStorageAdapter,
    IStoreRepository,
    InternalServerErrorException,
    NotFoundError,
    STORAGE_ADAPTER,
    STORAGE_ROOT_PATH, STORE_ENTITY_REPOSITORY,
    metaFilepath
} from "@ringcontent/core";
import path from "path";
import { autoInjectable, inject } from "tsyringe";

export type ReadFileIn = FileMetadata;
export type ReadFileOut = Buffer;

@autoInjectable()
export class ReadFileUseCase implements IUseCase<ReadFileIn, ReadFileOut> {
    constructor(
        @inject(STORAGE_ROOT_PATH) private readonly _rootPath: string,
        @inject(STORAGE_ADAPTER) private readonly storage: IStorageAdapter,
        @inject(STORE_ENTITY_REPOSITORY) private readonly _storeRepo: IStoreRepository,
    ) { };

    async execute(input: FileMetadata): Promise<ReadFileOut> {
        let filePath = this._rootPath;
        try {
            const store = await this._storeRepo.findById(input.store_id);
            filePath = path.join(filePath, store.root);
        } catch (error) {
            throw new InternalServerErrorException(`cannot fetch store`, undefined, error);
        }

        filePath = path.join(this._rootPath, metaFilepath(input));
        let exist = await this.storage.exists(filePath);

        if (!exist) {
            throw new NotFoundError(`file not exists`);
        }

        try {
            const buffer = this.storage.read(filePath);
            return buffer;
        } catch (error) {
            throw new InternalServerErrorException(`cannot read file`, undefined, error);
        }
    }
}