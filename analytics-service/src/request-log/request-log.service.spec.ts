import { Test, TestingModule } from '@nestjs/testing';
import { Repository, createConnection, getConnection, getRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { RequestLogService } from './request-log.service';
import { RequestEntity } from './request-log.entity';
import { IsUUID } from 'class-validator';
import { createRequestDto } from './request-log.dto';

describe('RequestLogService', () => {
  let service: RequestLogService;
  const testConnectionName = 'default';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestLogService,
        {
          provide: getRepositoryToken(RequestEntity),
          useClass: Repository,
        }
      ],
    }).compile();

    let connection = await createConnection({
      type: "postgres",
      database: "shorten",
      dropSchema: true,
      entities: [RequestEntity],
      synchronize: true,
      logging: false,
      name: testConnectionName,
    });    

    const repository = getRepository(RequestEntity, testConnectionName);
    service = new RequestLogService(repository);
    return connection
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return a valid record', async () => {
      const correlationId: string = uuid();
      const actionName: string = 'beatles';
      const dto: Partial<createRequestDto> = {
        url: 'http://www.google.com',
        status_code: 200,
      };

      const requestDto = await service.create(correlationId, actionName, dto);

      expect(requestDto).toBeInstanceOf(RequestEntity);

      expect(requestDto.correlation_id).toBe(correlationId);
      expect(requestDto.action).toBe(actionName);
      expect(requestDto.url).toBe(dto.url);
      expect(requestDto.status_code).toBe(dto.status_code);
      expect(requestDto.body).toBeInstanceOf(Object);
      expect(requestDto.query).toBeInstanceOf(Object);
      expect(requestDto.headers).toBeInstanceOf(Object);
    })
  })

  afterAll(async () => {
    await getConnection(testConnectionName).close()
  });

});
