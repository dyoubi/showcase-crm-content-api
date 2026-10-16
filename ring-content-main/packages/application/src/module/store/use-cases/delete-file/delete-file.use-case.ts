import { IUseCase } from "@egc-io/ckit-lib";
import {
    FILE_REPOSITORY, IFileRepository, IStorageAdapter, FileEntity, StoreEntity,
    IStoreRepository, STORE_ENTITY_REPOSITORY, STORAGE_ADAPTER,
    InternalServerErrorException
} from "@ringcontent/core";
import { autoInjectable, inject } from "tsyringe";
import { join } from "path";

export type DeleteFileIn = { file_id: string; };
export type DeleteFileOut = void;

@autoInjectable()
export class DeleteFileUseCase implements IUseCase<DeleteFileIn, DeleteFileOut> {
    constructor(
        @inject(FILE_REPOSITORY) private readonly _fileRepo: IFileRepository,
        @inject(STORAGE_ADAPTER) private readonly _storage: IStorageAdapter,
        @inject(STORE_ENTITY_REPOSITORY) private readonly _storeRepo: IStoreRepository,
    ) { }

    async execute(input: DeleteFileIn): Promise<DeleteFileOut> {
        let revisions: FileEntity[] = [];
        try {
            revisions = await this._fileRepo.find({ where: { file_id: input.file_id }, sort: { revision: 'DESC' } });
        } catch (error) {
            throw new InternalServerErrorException(`cannot fetch files`, undefined, error);
        }

        if (!revisions.length) { return; }

        const store_id = revisions[0].store_id;

        let store: StoreEntity;
        try {
            store = await this._storeRepo.findById(store_id);
        } catch (error) {
            throw new InternalServerErrorException(`cannot fetch store`, undefined, error);
        }

        const tasks: Promise<void>[] = [];
        for (const rev of revisions) {
            const file_path = join(store.root, `${rev.file_id}_${rev.revision}`);
            const meta_path = `${file_path}.meta`;
            tasks.push(this._storage.delete(file_path, false));
            tasks.push(
                this._storage.delete(meta_path, false)
                    .then(() => { this._fileRepo.deleteById(rev.guid); })
            );
        }

        try {
            await Promise.all(tasks);
        } catch (error) {
            throw new InternalServerErrorException(`incomplete task`, undefined, error);
        }
    }

}