import { FileSearchQuery, Store } from "@ringcontent/core";
import { QueryWhere } from "@egc-io/ckit-lib";
import { FileMetadata } from "./types";
import { UUID } from "crypto";

export type StoreOpts = {
	endpoint: string;
	secure: { client_id: string; client_secret: string; };
};
export class StoreAPI {
	private readonly endpoint: string;
	private readonly cient_id: string;
	private readonly cient_secret: string;

	constructor(opts: StoreOpts) {
		this.endpoint = opts.endpoint;
		this.cient_id = opts.secure.client_id;
		this.cient_secret = opts.secure.client_secret;
	}

	async stores(query: QueryWhere<Store>): Promise<Store[]> {
		const params: URLSearchParams = new URLSearchParams();
		if (query.where) { params.set('limit', JSON.stringify(query.where)); }
		if (query.limit) { params.set('limit', query.limit.toFixed(0)); }
		if (query.offset) { params.set('limit', query.offset.toFixed(0)); }
		const response = await fetch(`${this.endpoint}/stores?${params.toString()}`, { method: 'GET' });
		return (await response.json() as Store[]);
	};

	async search(store_id: UUID, query: FileSearchQuery): Promise<FileMetadata[]> {
		const params: URLSearchParams = new URLSearchParams();
		params.set('match', query.match);

		if (query.limit) { params.set('limit', query.limit.toFixed(0)); }
		if (query.offset) { params.set('offset', query.offset.toFixed(0)); }

		const response = await fetch(`${this.endpoint}/stores/${store_id}?${params.toString()}`, { method: 'GET' });
		return (await response.json() as FileMetadata[]);
	};
}