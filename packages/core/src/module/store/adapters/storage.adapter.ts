/**
 * Interact with the physical file storage
 */
export interface IStorageAdapter {
    /**
     * Create a directory within the file system
     * @param dir
     */
    mkdir(dir: string, recursive?: boolean): Promise<void>;

    /**
     * 
     * @param dir 
     */
    getFiles(dir: string, recursive?: boolean): Promise<string[]>;

    /**
     * Return true if the given path exist within the storage file tree
     * @param store_id store name
     * @param path file path to check
     */
    exists(path: string): Promise<boolean>;

    /**
     * 
     * @param path 
     * @param data 
     * @param recursive 
     */
    write(path: string, data: string | Buffer, recursive?: boolean): Promise<void>;


    /**
     * 
     * @param path 
     */
    read(path: string): Promise<Buffer>;

    /**
     * move the file to destination
     * @param from 
     * @param to 
     * @param directory 
     */
    move(path: string, destination: string, directory?: boolean): Promise<void>;

    /**
     * delete the path from disk
     * @param path 
     */
    delete(path: string, directory?: boolean): Promise<void>;
}

export const STORAGE_ADAPTER = Symbol('STORAGE_ADAPTER');