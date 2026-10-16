import 'reflect-metadata';

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { cwd } from 'process';

import { existsSync, mkdirSync, rmSync, unlinkSync } from 'fs';
import { join } from 'path';

import { CreateStoreUseCase } from './create-store.use-case';

import { DefaultOrg, Storage, StoreRepoMock } from "@ringcontent/test";

const CACHE_STORAGE_DIR = join(__dirname, '.cache');

const storage = new Storage(CACHE_STORAGE_DIR);
const storeRepo = new StoreRepoMock();

describe(CreateStoreUseCase, async () => {
	beforeAll(() => {
		if (!existsSync(CACHE_STORAGE_DIR)) {
			mkdirSync(CACHE_STORAGE_DIR, { recursive: true });
		}
	});

	afterAll(() => {
		if (existsSync(CACHE_STORAGE_DIR)) {
			rmSync(CACHE_STORAGE_DIR);
		}
	});

	const use = new CreateStoreUseCase(__dirname, storage, storeRepo);
	it('execute', async () => {
		const store = await use.execute({
			...DefaultOrg,
			name: 'CreateStoreUseCase',
		});

		expect(store).be.not.null;
		expect(store).be.not.undefined;
		expect(store).toBeTruthy;

		expect(existsSync(join(CACHE_STORAGE_DIR, store.root))).toBe(true);
		
	});

});