import { Test, TestingModule } from '@nestjs/testing';
import { Repository, createConnection, getConnection, getRepository, DeleteResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as uuid from 'uuid';

import { ShortURLService } from './short-url.service';
import { ShortURLEntity } from './short-url.entity';
import { response } from 'express';

describe.only('ShortURLService', () => {
  let service: ShortURLService;
  const testConnectionName = 'default';

  const correlationId: string = uuid.v4();
  const domainName: string = "www.bit.ly";

  let validUrlHash: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortURLService,
        {
          provide: getRepositoryToken(ShortURLEntity),
          useClass: Repository,
        }
      ],
    }).compile();

    let connection = await createConnection({
      type: "postgres",
      database: "shorten",
      dropSchema: true,
      entities: [ShortURLEntity],
      synchronize: true,
      logging: false,
      name: testConnectionName,
    });    

    const repository = getRepository(ShortURLEntity, testConnectionName);
    service = new ShortURLService(repository);
    return connection
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getShortURL', () => {
    it('should return a ping', async () => {
      const result = await service.ping()
      result.subscribe(response => {
        expect(response).toBe('Pong!')
      });
    });
  });

  describe('create', () => {
    it('should return a valid response', async () => {
      const url: string = 'www.google.com';
      const result = await service.create(correlationId, domainName, url)

      result.subscribe(response => {
        expect(response).toBeDefined()
        expect(typeof response.is_active).toBe('boolean');
        expect(typeof response.url).toBe('string');
        expect(typeof response.url_hash).toBe('string');
        expect(typeof response.url_id).toBe('number');
        validUrlHash = response.url_hash;
      });
    });
  });

  describe('update', () => {
    it('should return a valid response', async () => {
      const result = await service.update(correlationId, domainName, validUrlHash)
      result.subscribe(response => {
        expect(response).toBeDefined()
        expect(response.message).toBe('success');
        expect(typeof response.url).toBe('string');
        expect(typeof response.shortened_url).toBe('string');
        expect(typeof response.url_hash).toBe('string');
        validUrlHash = response.url_hash
      });
    });
  });

  describe('delete', () => {
    it('should return a valid response', async () => {
      const result = await service.delete(correlationId, validUrlHash)
      result.subscribe(response => {
        // expect(response).toBeInstanceOf(DeleteResult)
        expect(response.message).toBe('success')
      });
    });
  });

  afterAll(async () => {
    await getConnection(testConnectionName).close()
  });


});
