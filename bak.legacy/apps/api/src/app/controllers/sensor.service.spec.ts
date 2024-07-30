import { Test } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { SensorService } from './sensor.service';
import { Request } from 'express';

const queue = {
  add: jest.fn(),
  process: jest.fn()
}

describe('SensorService', () => {
  let service: SensorService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [SensorService, {provide: getQueueToken('sensor'), useValue: queue}]
    }).compile();

    service = app.get<SensorService>(SensorService);
  });

  describe('addToQueue', () => {
    it('should call queue add and return \'success\'!', async () => {
      const req = {
        originalUrl: '/device/sensing',
        headers: {},
        body: {}
      } as Request;
      expect(await service.addToQueue(req)).toEqual('success');
      expect(queue.add).toBeCalledTimes(1);
    });
  });
});
