import { IRegistry, IRepository, ModuleDefinition } from "@egc-io/ckit-lib";
import { FILE_REPOSITORY, STORE_ENTITY_REPOSITORY } from "@ringcontent/core";
import { DataSource, DATASOURCE, datasource, FileRepository, StoreRepository } from "@ringcontent/database";
import { Configuration, CONFIGURATION } from "../configuration";

export const DATABASE_MODULE: ModuleDefinition = {
	imports: [],
	setup: async (ioc: IRegistry) => {
		const configuration = ioc.get<Configuration>(CONFIGURATION);

		const ds = await datasource({
			database: configuration.getString('PG_DATABASE'),
			host: configuration.getString('PG_HOST'),
			port: configuration.getNumber('PG_PORT'),
			username: configuration.getString('PG_USER'),
			password: configuration.getString('PG_PASSWORD'),
			logging: true,
		});

		ioc.provide<DataSource>({ key: DATASOURCE, value: ds, });
		ioc.provide({
			key: STORE_ENTITY_REPOSITORY,
			value: new StoreRepository(ds)
		});
		ioc.provide({
			key: FILE_REPOSITORY,
			value: new FileRepository(ds),
		});
	},
};