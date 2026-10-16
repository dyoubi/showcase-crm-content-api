import { IRepository, IUseCase, logger } from "@egc-io/ckit-lib";
import {
    FILE_REPOSITORY, FileSearchQuery,
    IFileRepository,
    InternalServerErrorException,
    STORE_ENTITY_REPOSITORY,
    StoreEntity
} from "@ringcontent/core";
import { autoInjectable, inject } from "tsyringe";

export type SearchFileCountIn = {
    store_id: string;
    query: FileSearchQuery;
};
export type SearchFileCountOut = number;

@autoInjectable()
export class SearchFileCountUseCase implements IUseCase<SearchFileCountIn, SearchFileCountOut> {
    constructor(
        @inject(STORE_ENTITY_REPOSITORY) private readonly _storeRepo: IRepository<StoreEntity>,
        @inject(FILE_REPOSITORY) private readonly _fileRepo: IFileRepository,
    ) { }

    async execute(input: SearchFileCountIn): Promise<SearchFileCountOut> {
        let store: StoreEntity;
        try {
            store = await this._storeRepo.findById(input.store_id);
        } catch (error) {
            throw new InternalServerErrorException(`cannot fetch store`, undefined, error);
        }

        let count: number = 0;
        try {
            count = await this._fileRepo.searchCount(
                store.id,
                {
                    limit: input.query.limit,
                    offset: input.query.offset,
                    match: input.query.match,
                    sort: input.query.sort,
                }
            );
        } catch (error) {
            logger.error(error);
            throw new InternalServerErrorException(`cannot fetch files`, undefined, error);
        }

        return count;
    }


}