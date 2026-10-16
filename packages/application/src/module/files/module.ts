import { ModuleDefinition } from "@egc-io/ckit-lib";
import {
    WriteFileUseCase,
    ReadFileUseCase,
} from "./use-case";
import { GetFileUseCase } from "./use-case/get-file/get-file.use-case";

export const FilesModule: ModuleDefinition = {
    exports: [
        WriteFileUseCase,
        ReadFileUseCase,
        GetFileUseCase,
    ],
}