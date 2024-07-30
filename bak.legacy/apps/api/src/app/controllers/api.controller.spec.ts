import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { CommModule } from '@libs/comm';

describe('AppController', () => {
  let app: TestingModule;
  let apiController: ApiController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [CommModule],
      controllers: [ApiController],
      providers: [],
    }).compile();

    apiController = app.get<ApiController>(ApiController);

  });

  describe('timestamp', () => {
    it('should return current timestamp IOSString', () => {
      const date = apiController.timestamp();
      const parsedDate = new Date(Date.parse(date));
      expect(parsedDate.toISOString()).toEqual(date);
    });
  });

});
