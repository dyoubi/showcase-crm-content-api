import {
    STORE_ENTITY_REPOSITORY, IStoreRepository, STORAGE_ADAPTER,
    IStorageAdapter, FILE_REPOSITORY, IFileRepository, FileMetadata,
    InternalServerErrorException,
    NotFoundError
} from "@ringcontent/core";
import { IUseCase } from "@egc-io/ckit-lib";
import { autoInjectable, inject } from "tsyringe";

export type UpdateFileIn = {
    file_id: string;
    data: Partial<Pick<FileMetadata, 'description' | 'name'>>;
};
export type UpdateFileOut = void;

@autoInjectable()
export class UpdateFileUseCase implements IUseCase<UpdateFileIn, UpdateFileOut> {
    constructor(
        @inject(STORE_ENTITY_REPOSITORY) private readonly _storeRepo: IStoreRepository,
        @inject(STORAGE_ADAPTER) private readonly _storage: IStorageAdapter,
        @inject(FILE_REPOSITORY) private readonly _fileRepo: IFileRepository,
    ) { }

    async execute(input: UpdateFileIn): Promise<UpdateFileOut> {
        let file: FileMetadata | null = null;
        try {
            file = await this._fileRepo.getByFileID(input.file_id);
        } catch (error) { throw new InternalServerErrorException(`cannot fetch file`, undefined, error); }

        if (!file) { throw new NotFoundError(`file not found`); }

        try {
            const data: Partial<FileMetadata> = {
                ...input.data,
                updated_at: new Date(),
            };
            await this._fileRepo.update(data, { file_id: { eq: input.file_id } });
        } catch (error) { throw new InternalServerErrorException(`cannot update file`, undefined, error); }
        try {
            // TODO we need to update the meta file on disk for keep coherant data
        } catch (error) { throw new InternalServerErrorException(`cannot update file`, undefined, error); }

    }
}