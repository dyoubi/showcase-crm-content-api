import { Test, TestingModule } from '@nestjs/testing';
import { StoreByIdFilesController } from './store-by-id-files.controller';

describe('StoreByIdFilesController', () => {
  let controller: StoreByIdFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreByIdFilesController],
    }).compile();

    controller = module.get<StoreByIdFilesController>(StoreByIdFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
