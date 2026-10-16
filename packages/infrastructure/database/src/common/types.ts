export type PostgresOptions = {
	host: string;
	port: number;
	database: string;
	username: string;
	password: string;
	synchronize?: boolean,
	installExtensions?: boolean,
	logging?: boolean,
	subscribers?: any[];
};

export * from './query-transform';
