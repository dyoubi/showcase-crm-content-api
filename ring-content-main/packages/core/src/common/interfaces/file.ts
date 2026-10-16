import { Query } from "@egc-io/ckit-lib";
import { FileEntity } from "../../module/files";

export interface FileMetadata {
    /**
     * file within the store
     */
    file_id: string;

    /**
     * unique file id unique for each revision
     */
    guid: string;

    /**
     * file title
     */
    name: string;

    /**
     * file title
     */
    description: string;

    /**
     * full file name
     * @example 'banner-xl.png'
     */
    file_name: string;
    
    /**
     * File extension name 
     * @example '.png'
     */
    file_extension: string;

    /**
     * File size in byte
     */
    size: number;

    /**
     * File mime type (e.g: application/json)
     */
    mimetype: string;

    /**
     * Revision count of the file
     */
    revision: number;
    
    /**
     * Internal file path relative to the root storage directory
     * @example '/img/banners'
     */
    store_path: string;
    store_id: string;
    created_at: Date;
    updated_at: Date;
}

export type FileMatch = string;

export type FileSearchQuery = Query<FileEntity> & {
    limit?: number;
    offset?: number,
    match: FileMatch;
};