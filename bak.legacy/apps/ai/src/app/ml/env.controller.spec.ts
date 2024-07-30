import { Test, TestingModule } from '@nestjs/testing';

import { EnvController } from './env.controller';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [EnvController],
      providers: [],
    }).compile();
  });
});
