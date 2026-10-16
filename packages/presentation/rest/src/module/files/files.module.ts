import { Module } from '@nestjs/common';
import { FileByIdController } from './controllers/file-by-id/file-by-id.controller';

@Module({
  controllers: [FileByIdController],
})
export class FilesModule {}
