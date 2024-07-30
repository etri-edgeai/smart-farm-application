import { Test, TestingModule } from '@nestjs/testing';
import { KbController } from './kb.controller';

describe('KbController', () => {
  let controller: KbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KbController],
    }).compile();

    controller = module.get<KbController>(KbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
