import { IUseCase } from "@egc-io/ckit-lib";
import {
    BadRequestError,
    ConflictError,
    FILE_REPOSITORY, FileEntity,
    FileHash, FileMetadata, IFileRepository,
    InternalServerErrorException,
    IStorageAdapter,
    IStoreRepository, Mimetype, NotAcceptableError, STORAGE_ADAPTER, STORE_ENTITY_REPOSITORY
} from "@ringcontent/core";
import { UUID } from "crypto";
import path, { basename, extname } from "path";
import { autoInjectable, inject } from "tsyringe";

export type UploadFileIn = {
    buffer: Buffer,
    store_id: UUID,
    metadata: {
        store_path: string;
        file_id?: string;
        name?: string;
        description?: string;
        file_name: string;
        mimetype: string;
    };
    update?: boolean,
};
export type UploadFileOut = FileMetadata;

@autoInjectable()
export class UploadFileUseCase implements IUseCase<UploadFileIn, UploadFileOut> {

    constructor(
        @inject(STORE_ENTITY_REPOSITORY) private readonly _storeRepo: IStoreRepository,
        @inject(STORAGE_ADAPTER) private readonly _storage: IStorageAdapter,
        @inject(FILE_REPOSITORY) private readonly _fileRepo: IFileRepository,
    ) { }

    async execute(input: UploadFileIn): Promise<UploadFileOut> {
        let meta: FileMetadata = new FileEntity();
        Object.assign(meta, input.metadata);
        let file_path: string;

        try {
            const store = await this._storeRepo.findById(input.store_id);
            file_path = store.root;
        } catch (error) {
            throw new InternalServerErrorException(`cannot fetch store`, undefined, error);
        }

        // build metadata 
        meta.store_id = input.store_id;
        meta.file_id = input.metadata.file_id ?? FileHash(meta);
        meta.size = input.buffer.length;
        if (!Mimetype.includes(input.metadata.mimetype)) {
            throw new BadRequestError(`mimetype ${input.metadata.mimetype} is not allowed`, { mimetype: input.metadata.mimetype });
        }

        if (!meta.name) { meta.name = basename(meta.file_name); }
        meta.file_extension = extname(meta.file_name);

        if (!meta.store_path) {
            meta.file_id = input.metadata.file_id ?? '/';
        }

        // ensure revision
        let revisionList = [];
        try {
            revisionList = await this._fileRepo.find({
                where: {
                    file_id: meta.file_id,
                    store_id: input.store_id,
                }
            });
            meta.revision = revisionList.length > 0 ? revisionList.length : 0;
        } catch (error) {
            throw new InternalServerErrorException(`cannnot fetch revisions`, undefined, error);
        }

        if (revisionList.length > 0 && input?.update !== true) {
            throw new ConflictError(`file already exists`);
        }
        // write file on disk
        file_path = `${file_path}/${meta.file_id}_${meta.revision}`;
        const meta_path = `${file_path}.meta`;
        try {
            this._storage.write(file_path, input.buffer, true);
            this._storage.write(meta_path, JSON.stringify(meta));
        } catch (error) {
            throw new InternalServerErrorException(`cannot write file`, undefined, error);
        }

        // store metadata
        try {
            meta = await this._fileRepo.create(meta);
        } catch (error) {
            throw new InternalServerErrorException(`cannnot create file metadata`, undefined, error);
        }
        return meta;
    }
}