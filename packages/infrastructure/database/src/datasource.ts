import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import {
    PostgresOptions, createDataSource,
    createPostgresDataSourceOptions
} from './common';
import { FileEntitySchema, StoreEntitySchema } from "./entities";
import { Init1734615918849 } from "./migrations/1734615918849-init";

export * from './entities';

const AppDatabaseOptions: Partial<DataSourceOptions> = {
    entities: [StoreEntitySchema, FileEntitySchema],
    synchronize: false,
    debug: true,
    logger:'advanced-console',
    migrations: [Init1734615918849,],
};

export async function datasource(options: PostgresOptions) {
    const settings = Object.assign({}, createPostgresDataSourceOptions(options), AppDatabaseOptions);
    return await createDataSource(settings);
}

export const DATASOURCE: symbol = Symbol('DATASOURCE');

export { DataSource };

export class PgEnv {
    PG_DATABASE: string;
    PG_HOST: string;
    PG_PORT: number;
    PG_USER: number;
    PG_PASSWORD: number;
};