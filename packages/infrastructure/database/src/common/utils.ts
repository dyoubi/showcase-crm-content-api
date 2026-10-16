import { DataSource, DataSourceOptions } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

/**
 * Creates a DataSourceOptions object for PostgreSQL with the specified configuration options.
 *
 * @param options PostgreSQL connection options.
 * @returns DataSourceOptions object.
 */
export function createPostgresDataSourceOptions(options: Partial<DataSourceOptions>): PostgresConnectionOptions {
	return Object.assign({}, options, { type: 'postgres' as 'postgres', });
}
/**
 * Creates a TypeORM DataSource with the specified database options.
 *
 * @param options Database connection options.
 * @returns Promise<DataSource> TypeORM Connection instance.
 */
export async function createDataSource(options: DataSourceOptions): Promise<DataSource> {
	const datasource = new DataSource(options);
	console.info('\x1b[34m%s\x1b[0m', 'initializing datasource ...');
	await datasource.initialize();
	return datasource;
}
