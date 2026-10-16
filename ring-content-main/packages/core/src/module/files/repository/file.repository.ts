import { IRepository } from "@egc-io/ckit-lib";
import { FileEntity } from "../entity";
import { FileSearchQuery } from "../../../common";
import { FileHeader } from "../dto/file.dto";

export interface IFileRepository extends IRepository<FileEntity> {
    search(store_id: string, query: FileSearchQuery): Promise<FileHeader[]>;
    searchCount(store_id: string, query: FileSearchQuery): Promise<number>;
    
    getByFileID(store_hash: string, revision?: number): Promise<FileEntity | null>;
}
export const FILE_REPOSITORY = Symbol("FILE_REPOSITORY");