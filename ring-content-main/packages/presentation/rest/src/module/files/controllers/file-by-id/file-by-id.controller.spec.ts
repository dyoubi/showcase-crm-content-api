import { Test, TestingModule } from '@nestjs/testing';
import { FileByIdController } from './file-by-id.controller';

describe('FileController', () => {
  let controller: FileByIdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileByIdController],
    }).compile();

    controller = module.get<FileByIdController>(FileByIdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
