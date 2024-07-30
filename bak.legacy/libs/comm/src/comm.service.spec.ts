import { Test } from '@nestjs/testing';
import { CommService } from './comm.service';

describe('CommService', () => {
  let service: CommService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CommService],
    }).compile();

    service = module.get(CommService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
