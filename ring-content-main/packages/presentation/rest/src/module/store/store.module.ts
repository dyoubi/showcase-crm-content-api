import { Module } from '@nestjs/common';
import { StoresController } from './controllers/stores/stores.controller';
import { StoreByIdController } from './controllers/store-by-id/store-by-id.controller';
import { StoreByIdFilesController } from './controllers/store-by-id-files/store-by-id-files.controller';

@Module({
	controllers: [StoresController, StoreByIdController, StoreByIdFilesController]
})
export class StoreModule { }
