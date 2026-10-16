import { Test, TestingModule } from '@nestjs/testing';
import { StoreByIdController } from './store-by-id.controller';

describe('StoreByIdController', () => {
  let controller: StoreByIdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreByIdController],
    }).compile();

    controller = module.get<StoreByIdController>(StoreByIdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
