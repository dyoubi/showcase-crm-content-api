import { FileMetadata } from "../../../common";

/**
 * File System Accessor class, that interact with a file within the physical storage
 */
export interface FileAccessorAdapter {
    read(meta: FileMetadata): Promise<Buffer>;
    delete(meta: FileMetadata): Promise<boolean>;
    exists(meta: FileMetadata): Promise<boolean>;
    /**
     *  Move a file within the file system
     * @param meta the file to move
     * @param destination  destination path relative to the store root path
     */
    move(meta: FileMetadata, destination: string): Promise<FileMetadata>;
}
export const FILE_ACCESS = Symbol('');