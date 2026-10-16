import { FileMetadata } from "../../../common/interfaces";

export class FileEntity implements FileMetadata {
    guid: string;
    name: string;
    description: string;
    file_id: string;
    file_name: string;
    file_extension: string;
    size: number;
    mimetype: string;
    revision: number;
    store_id: string;
    store_path: string;
    created_at: Date;
    updated_at: Date;
}