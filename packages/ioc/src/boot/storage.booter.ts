import { ModuleDefinition, IRegistry } from "@egc-io/ckit-lib";
import { CONFIGURATION, Configuration } from "../configuration";
import { Storage } from "@ringcontent/storage";
import { IStorageAdapter, STORAGE_ADAPTER, STORAGE_ROOT_PATH } from "@ringcontent/core";

export const STORAGE_MODULE: ModuleDefinition = {
	imports: [],
	setup: async (ioc: IRegistry) => {
		const configuration = ioc.get<Configuration>(CONFIGURATION);
		const root = configuration.getString('STORAGE_ROOT_PATH');
		const storage = new Storage(root);

		ioc.provide<string>({ key: STORAGE_ROOT_PATH, value: root });
		ioc.provide<IStorageAdapter>({ key: STORAGE_ADAPTER, value: storage });
	}
};