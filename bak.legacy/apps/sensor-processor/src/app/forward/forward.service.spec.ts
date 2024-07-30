import { Test, TestingModule } from '@nestjs/testing';
import { ForwardService } from './forward.service';

describe('ForwardService', () => {
  let service: ForwardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForwardService],
    }).compile();

    service = module.get<ForwardService>(ForwardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
