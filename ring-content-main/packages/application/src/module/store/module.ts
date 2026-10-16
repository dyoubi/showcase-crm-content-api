import { ModuleDefinition } from "@egc-io/ckit-lib";
import { SearchFileUseCase, CreateStoreUseCase, UploadFileUseCase, DeleteFileUseCase, UploadRevisionUseCase } from "./use-cases";
import { UpdateFileUseCase } from "./use-cases/update-file/update-file.use-case";

export const StoreModule: ModuleDefinition = {
	exports: [
		CreateStoreUseCase,
		UploadFileUseCase,
		UploadRevisionUseCase,
		UpdateFileUseCase,
		DeleteFileUseCase,
		SearchFileUseCase,
	],
};