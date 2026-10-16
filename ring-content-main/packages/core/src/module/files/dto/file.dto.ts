import { FileMetadata } from "../../../common";

export type FileHeader = Pick<FileMetadata,
	| 'guid'
	| 'name'
	| 'file_id'
	| 'file_name'
	| 'mimetype'
	| 'created_at'
	| 'store_path'
>;