import { FileMetadata } from "../../common";

export function revisionPrefix(meta: FileMetadata): string {
    return meta.revision ? `-${meta.revision.toFixed(0)}` : '';
}

export function metaFilepath(meta: FileMetadata): string {
    return `${meta.store_path}/${revisionPrefix(meta)}${meta.file_extension}`;
}