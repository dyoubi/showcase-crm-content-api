import { IStorageAdapter } from "@ringcontent/core";
import {
	existsSync, mkdirSync, readdirSync,
	readFileSync, rmSync, unlinkSync, writeFileSync
} from "fs";

import { dirname, join } from "path";

export class Storage implements IStorageAdapter {
	constructor(private readonly _root: string) { };

	getPath(str: string) { return join(this._root, str); }

	async mkdir(dir: string, recursive?: boolean): Promise<void> {
		mkdirSync(this.getPath(dir), { recursive });
	}

	async getFiles(dir: string, recursive?: boolean): Promise<string[]> {
		return readdirSync(this.getPath(dir), { recursive, withFileTypes: true }).map(m => m.parentPath);
	}

	async exists(path: string): Promise<boolean> {
		return existsSync(this.getPath(path));
	}

	async write(path: string, data: string | Buffer, recursive?: boolean): Promise<void> {
		const final_path = this.getPath(path);
		const dir = dirname(final_path);
		if (recursive === true) {
			if (!existsSync((final_path))) {
				mkdirSync(dir, { recursive: true });
			}
		}
		writeFileSync(final_path, data);
	}

	async read(path: string): Promise<Buffer> {
		return readFileSync(this.getPath(path));
	}

	async move(path: string, destination: string, directory?: boolean): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async delete(path: string, directory?: boolean): Promise<void> {
		rmSync(this.getPath(path), { recursive: directory });
	}
}