import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FilesModule } from './module/files/files.module';
import { CommonModule } from './common/common.module';
import { StoreModule } from './module/store/store.module';
import { HealthModule } from './module/health/health.module';

@Module({
  imports: [
    CommonModule.forRoot(),
    HealthModule,
    StoreModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
