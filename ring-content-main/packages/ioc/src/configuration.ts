import { readFileSync } from "fs";
import { parseEnv } from "util";

export const CONFIGURATION: symbol = Symbol('CONFIGURATION');

export class Configuration {
	private readonly values: Map<string, any> = new Map();
	static from(values: Record<string, unknown>) {
		const configuration = new Configuration();
		for (const k in values) {
			configuration.values.set(k, values[k]);
		}
		return configuration;
	}

	static parse(envPath: string) {
		const values = parseEnv(readFileSync(envPath).toString()) as Record<string, unknown>;
		const configuration = new Configuration();
		for (const k in values) {
			configuration.values.set(k, values[k]);
		}
		return configuration;
	}

	getValue(key: string) {
		const val = this.getValueOrNull(key);
		if (!val) {
			throw new Error(`${key} is null`);
		}
		return val;
	}

	getValueOrNull(key: string) {
		if (this.values.has(key)) {
			return this.values.get(key);
		}
		return null;
	}
	getStringNull(key: string) {
		return this.getValueOrNull(key) as string;
	}
	getString(key: string) {
		return this.getValue(key) as string;
	}
	getNumber(key: string) {
		return this.getValue(key) as number;
	}
	getNumberOrNull(key: string) {
		return this.getValueOrNull(key) as number;
	}

	getObjectOrNull(key: string) {
		const val = this.getValueOrNull(key);
		if (!val) {
			return null;
		}
		try {
			return JSON.parse(val);
		} catch (error) {
			throw new Error('value is not an object');
		}
	}

	getObject(key: string) {
		try {
			const val = this.getString(key);
			return JSON.parse(val);
		} catch (error) {
			throw new Error('value is not an object');
		}
	}
	list() {
		const keys: string[] = [];
		for (const k of this.values.keys()) { keys.push(k); }
		return keys;
	}
}