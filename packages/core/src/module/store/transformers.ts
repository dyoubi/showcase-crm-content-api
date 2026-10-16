import { hash } from "crypto";
import { join, relative } from "path";

export function StoreDirectoryName(input: { org_id: string, operator_id: string; }): string {
	return hash('sha256', `${input.org_id}_${input.operator_id}`);
}

export function FileHash(input: {
	store_id: string,
	store_path: string,
	file_name: string,
	mimetype: string;
}) {
	return hash('sha256', `${input.store_id}:${input.store_path}:${input.file_name}:${input.mimetype}`);
}

export function MakeStorePath(dist: string) {
	return join('/', dist);
}