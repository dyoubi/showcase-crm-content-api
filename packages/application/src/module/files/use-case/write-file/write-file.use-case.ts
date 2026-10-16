import { IRepository, IUseCase } from "@egc-io/ckit-lib";
import {
    FILE_REPOSITORY, FileMetadata, IFileRepository,
    InternalServerErrorException,
    IStorageAdapter,
    metaFilepath, STORAGE_ADAPTER, STORAGE_ROOT_PATH, STORE_ENTITY_REPOSITORY, StoreEntity
} from "@ringcontent/core";
import path from "path";
import { autoInjectable, inject } from "tsyringe";

export type WriteFileIn = {
    buffer: Buffer,
    meta: Omit<FileMetadata, 'guid' | 'created_at' | 'updated_at' | 'revision'>,
};
export type WriteFileOut = FileMetadata;

@autoInjectable()
export class WriteFileUseCase implements IUseCase<WriteFileIn, WriteFileOut> {

    constructor(
        @inject(STORAGE_ROOT_PATH) private readonly _rootPath: string,
        @inject(STORAGE_ADAPTER) private readonly storage: IStorageAdapter,
        @inject(STORE_ENTITY_REPOSITORY) private readonly _storageRepo: IRepository<StoreEntity>,
        @inject(FILE_REPOSITORY) private readonly _fileRepo: IFileRepository,
    ) { }

    async execute(input: WriteFileIn): Promise<WriteFileOut> {
        const meta = { ...input.meta } as FileMetadata;
        let filePath = path.join(this._rootPath);

        try {
            const store = await this._storageRepo.findById(input.meta.store_id);
            filePath = path.join(filePath, store.root);
        } catch (error) {
            throw new InternalServerErrorException(`cannot fetch storage`, undefined, error);
        }

        try {
            const revisions = await this._fileRepo.find({
                where: {
                    store_id: meta.store_id,
                    store_path: meta.store_path,
                    file_extension: meta.file_extension,
                    file_name: meta.file_name,
                },
            });
            meta.revision = revisions.length;
        } catch (error) {
            throw new InternalServerErrorException(`cannot fetch metadata`, undefined, error);
        }

        try {
            filePath = path.join(filePath, metaFilepath(meta));
            while (await this.storage.exists(filePath)) {
                meta.revision += 1;
                filePath = path.join(filePath, metaFilepath(meta));
            }
        } catch (error) {
            throw new InternalServerErrorException(`cannot create file`, undefined, error);
        }

        try {
            await this.storage.write(filePath, input.buffer);
        } catch (error) {
            throw new InternalServerErrorException(`cannot create file`, undefined, error);
        }

        try {
            return (await this._fileRepo.create(meta));
        } catch (error) {
            try {
                await this.storage.delete(filePath);
            } catch (err) {
                throw new InternalServerErrorException(`use case critical failure`, error, err);
            }
            throw new InternalServerErrorException(`cannot create file metadata`, undefined, error);
        }
    }
}