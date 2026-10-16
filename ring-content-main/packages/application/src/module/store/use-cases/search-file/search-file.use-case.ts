import { IRepository, IUseCase, logger } from "@egc-io/ckit-lib";
import {
    FILE_REPOSITORY, FileSearchQuery,
    IFileRepository,
    InternalServerErrorException,
    STORE_ENTITY_REPOSITORY,
    StoreEntity
} from "@ringcontent/core";
import { FileHeader } from "@ringcontent/core/dist/module/files/dto/file.dto";
import { autoInjectable, inject } from "tsyringe";

export type SearchFileIn = {
    store_id: string;
    query: FileSearchQuery;
};
export type SearchFileOut = Array<FileHeader>;

@autoInjectable()
export class SearchFileUseCase implements IUseCase<SearchFileIn, SearchFileOut> {
    constructor(
        @inject(STORE_ENTITY_REPOSITORY) private readonly _storeRepo: IRepository<StoreEntity>,
        @inject(FILE_REPOSITORY) private readonly _fileRepo: IFileRepository,
    ) { }

    async execute(input: SearchFileIn): Promise<SearchFileOut> {
        let store: StoreEntity;
        try {
            store = await this._storeRepo.findById(input.store_id);
        } catch (error) {
            logger.error(error.message);
            throw new InternalServerErrorException(`cannot fetch store (${error.message})`, undefined, error);
        }

        let matchList: SearchFileOut = [];
        try {
            matchList = await this._fileRepo.search(
                store.id,
                {
                    limit: input.query.limit,
                    offset: input.query.offset,
                    match: input.query.match,
                    sort: input.query.sort,
                }
            );
        } catch (error) {
            logger.error(error.message);
            throw new InternalServerErrorException(`cannot fetch files`, undefined, error);
        }
        return matchList;
    }


}