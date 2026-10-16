import {
    FILE_REPOSITORY, FileMetadata, IFileRepository, IStorageAdapter,
    IStoreRepository, STORAGE_ADAPTER, STORE_ENTITY_REPOSITORY
} from "@ringcontent/core";
import { InternalServerErrorException, IUseCase } from "@egc-io/ckit-lib";
import { autoInjectable, inject } from "tsyringe";

export type UploadRevisionIn = {
    file_id: string;
    buffer: Buffer;
    meta?: Partial<FileMetadata>;
};
export type UploadRevisionOut = FileMetadata;


@autoInjectable()
export class UploadRevisionUseCase implements IUseCase<UploadRevisionIn, UploadRevisionOut> {

    constructor(
        @inject(STORE_ENTITY_REPOSITORY) private readonly _storeRepo: IStoreRepository,
        @inject(STORAGE_ADAPTER) private readonly _storage: IStorageAdapter,
        @inject(FILE_REPOSITORY) private readonly _fileRepo: IFileRepository,
    ) { }

    async execute(input: UploadRevisionIn): Promise<FileMetadata> {
        let file: FileMetadata | null = null;
        let file_path: string;
        let revision: number;

        try {
            file = await this._fileRepo.getByFileID(input.file_id);
        } catch (error) {
            throw new Error(`cannot fetch file ${error.message}`);
        }

        if (!file) {
            throw new Error(`file not found`);
        }

        revision = file.revision + 1;

        try {
            const store = await this._storeRepo.findById(file.store_id);
            file_path = store.root;
        } catch (error) {
            throw new InternalServerErrorException(`cannot fetch store`, undefined, error);
        }

        const new_meta: Omit<FileMetadata, 'guid'> = Object.assign(file, input.meta ?? {}, {
            guid: undefined,
            revision,
        });

        file_path = `${file_path}/${new_meta.file_id}_${new_meta.revision}`;
        // write file on disk
        const meta_path = `${file_path}.meta`;
        try {
            this._storage.write(file_path, input.buffer, true);
            this._storage.write(meta_path, JSON.stringify(new_meta));
        } catch (error) {
            throw new InternalServerErrorException(`cannot write file`, undefined, error);
        }

        // store metadata
        try {
            const meta = await this._fileRepo.create(new_meta);
            return meta;
        } catch (error) {
            throw new InternalServerErrorException(`cannnot create file metadata`, undefined, error);
        }
    }

}