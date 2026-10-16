import { IRegistry, ModuleDefinition } from '@egc-io/ckit-lib';
import { Configuration, Ioc, DATABASE_MODULE, CONFIGURATION, STORAGE_MODULE } from '@ringcontent/ioc';
import { FactoryProvider, Scope } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { parseEnv } from 'util';


export const IOC = Symbol('IOC');
export const IocProvider: FactoryProvider<IRegistry> = {
	provide: IOC,
	async useFactory() {
		
		const envPath = `${__dirname}/../../.env`;
		const env = existsSync(envPath) ? parseEnv(readFileSync(envPath).toString()) as Record<string, unknown> : process.env;
		const configModule: ModuleDefinition = {
			exports: [{
				key: CONFIGURATION,
				value: Configuration.from(env),
			}]
		};
		const ioc = new Ioc([configModule, DATABASE_MODULE, STORAGE_MODULE]);
		await ioc.setup();
		return ioc;
	}
};