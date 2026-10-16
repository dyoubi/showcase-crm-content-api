import { IStoreRepository, Store, STORE_ENTITY_REPOSITORY } from '@ringcontent/core';
import { Ioc } from '@ringcontent/ioc';
import { Query as QueryObject } from '@egc-io/ckit-lib';
import {
	BadRequestException, Controller,
	Get, Inject, Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IOC } from 'src/common/ioc';

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
	constructor(
		@Inject(IOC) private readonly _ioc: Ioc,
	) { }

	sanityzeQuery(query: QueryObject<Store>) {
		if (query.sort && typeof query.sort !== 'object') {
			query.sort = JSON.parse(query.sort as string);
		}

		if (query.where && typeof query.where !== 'object') {
			query.where = JSON.parse(((query.where as string).replaceAll('*', '%')));
		}
		return query;
	}

	@Get('count')
	async count(
		@Query() query: QueryObject<Store>
	) {
		const repo = this._ioc.get<IStoreRepository>(STORE_ENTITY_REPOSITORY);
		try {
			const count = await repo.count(this.sanityzeQuery(query));
			return count;
		} catch (error) {
			throw new BadRequestException(`${error.message}`);
		}
	}

	@Get()
	async get(
		@Query() query: QueryObject<Store>
	) {
		const repo = this._ioc.get<IStoreRepository>(STORE_ENTITY_REPOSITORY);
		try {
			const storeList = await repo.find(this.sanityzeQuery(query));
			return storeList;
		} catch (error) {
			throw new BadRequestException(`${error.message}`);
		}
	}
}
