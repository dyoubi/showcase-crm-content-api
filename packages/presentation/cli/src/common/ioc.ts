import { IRegistry } from "@egc-io/ckit-lib";

import {
	CONFIGURATION, Configuration, Ioc,
	DATABASE_MODULE, STORAGE_MODULE
} from "@ringcontent/ioc";
import { configDotenv } from "dotenv";
import { existsSync } from "fs";
import path = require("path");

let __g_context: IRegistry;

export const setup = async () => {
	if (__g_context) {
		throw new Error('context already set');
	}
	const envPath = path.join(__dirname, '../../.env');
	if (existsSync(envPath)) {
		configDotenv({ path: envPath, debug: true });
	}
	const configModule = {
		exports: [{
			key: CONFIGURATION,
			value: Configuration.from(process.env),
		}],
	};
	__g_context = new Ioc([configModule, DATABASE_MODULE, STORAGE_MODULE]);
	try {
		await __g_context.setup();
	} catch (error) {
		const msg = error instanceof Error ? error.message : 'unkown reason';
		throw new Error(`init context failure:\n${msg}`);
	}
}

export const context = (): Readonly<IRegistry> => {
	return __g_context;
};
