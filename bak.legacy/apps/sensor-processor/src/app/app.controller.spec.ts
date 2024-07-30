import { CommonConfigModule } from '@libs/config';
import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;
  let appController: AppController;
  let appService: AppService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [HttpModule, CommonConfigModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    appService = app.get(AppService);
    appController = app.get<AppController>(AppController);
  });

  describe('forwardSensor', () => {
    it('should return', async () => {
      // return true;
      /*
      const req: SensorRequest = new SensorRequest();
      const channel: RedisContext = new RedisContext(null);
      jest.spyOn(appService, "forward").mockImplementation(async () => ['']);
      const tt = await appController.forwardSensor(req, channel);
      console.log("TT: ", tt);

      //expect(await appController.forwardSensor(req, null)).toEqual({ message: 'Welcome to SensorForward!' });
      */
    });
  });
});
