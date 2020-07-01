import { Test, TestingModule } from '@nestjs/testing';
import { RequestLogService } from './request-log.service';

describe('RequestLogService', () => {
  let service: RequestLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestLogService],
    }).compile();

    service = module.get<RequestLogService>(RequestLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
