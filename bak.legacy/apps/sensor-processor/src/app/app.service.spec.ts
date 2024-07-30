import { CommonConfigModule } from '@libs/config';
import { HttpModule } from '@nestjs/axios';
import { Test } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [HttpModule, CommonConfigModule],
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('loadForwardDevices', () => {
    it('should return devices map', async () => {
      //await service.loadForwardDevices();
      //expect(service.devices.size).toBeGreaterThan(0);
    });
  });
});
