import { Test, TestingModule } from '@nestjs/testing';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';

describe('SensorController', () => {
  let controller: SensorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorController],
    })
    .useMocker((token) => {
      if (token === SensorService) {
        return { addToQueue: jest.fn() };
      }
    })
    .compile();

    controller = module.get(SensorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
