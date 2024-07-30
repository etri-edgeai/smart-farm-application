import { Test, TestingModule } from '@nestjs/testing';
import { PestController } from './pest.controller';

describe('PestController', () => {
  let controller: PestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PestController],
    }).compile();

    controller = module.get<PestController>(PestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
