import { createHash, hash, randomUUID, UUID } from "node:crypto";
import { StoreEntity } from '@ringcontent/core';
import { existsSync, mkdirSync } from "node:fs";
import { extname } from "node:path";

export type Content = {
	fileName: string;
	description: string;
	data: Buffer,
	tag: string;
};

export function description(fileName: string, tag?: string) {
	const ext = extname(fileName);
	const name = ext ? fileName.split('.')[0] : fileName;
	const entries = [
		`Name: ${name}`,
		`Type: ${ext}`,
		`Tag: ${tag ?? ''}`,
	];
	return entries.join(';\n');
}


export function ensureDir(dir: string) {
	if (!existsSync(dir)) { mkdirSync(dir, { recursive: true }); }
}

export type Org = {
	org_id: UUID;
	operator_id: UUID;
};

export function uuid(seed: string = '0'): UUID {
	const hash = createHash('sha256').update(seed).digest('hex');
	return `${hash.substring(0, 8)}-${hash.substring(8, 4)}-${'4' + hash.substring(12, 3)}-${'8' + hash.substring(15, 3)}-${hash.substring(18, 12)}`;
}

export const getOrgID = (): UUID => { return randomUUID(); };
export const getOperatorID = (): UUID => { return randomUUID(); };

export const newOrg = (): Org => {
	return {
		org_id: getOrgID(),
		operator_id: getOperatorID()
	};
};

export const newStore = (org: Org): StoreEntity => {
	const name = hash('SHA256', org.org_id.concat(org.operator_id)).toUpperCase();
	return {
		id: uuid(name),
		name,
		root: name,
		...org,
	};
};

export const DefaultOrg: Org = {
	org_id: uuid('org_id:0'),
	operator_id: uuid('operator_id:0'),
};

export const DefaultStore = newStore(DefaultOrg);