import { Test, TestingModule } from '@nestjs/testing';
import { Repository, createConnection, getConnection, getRepository, DeleteResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as uuid from 'uuid';

import { ShortURLService } from './short-url.service';

import { ShortURLEntity } from './short-url.entity';
import { domain } from 'process';


describe.only('ShortURLService', () => {
  let service: ShortURLService;
  const testConnectionName = 'default';

  let validUrlId: number;
  let validUrl: string;
  let validUrlHash: string;
  let validShortenedUrl: string;

  const correlationId: string = uuid.v4();
  const domainName: string = "www.bit.ly";

  const invalidUrl: string = 'randomrandom';
  const invalidUrlHash: string = 'randomrandom';

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
      const response = await service.ping()
      expect(response).toBe('Pong!')
    });
  });

  describe('buildShortUrlRO', () => {
    it('should return a valid response', async () => {
      const newShortUrlRecord = new ShortURLEntity();
      newShortUrlRecord.url_id = 21;
      newShortUrlRecord.url = 'www.google.com';
      newShortUrlRecord.url_hash = 'ABCDEFG';
      newShortUrlRecord.shortened_url = 'www.bit.ly/ABCDEFG';
      newShortUrlRecord.is_active = false;

      const response = await service.buildShortUrlRO(newShortUrlRecord)
      expect(response).toBeDefined()
      expect(response.url_id).toBe(newShortUrlRecord.url_id);
      expect(response.url_hash).toBe(newShortUrlRecord.url_hash);
      expect(response.url).toBe(newShortUrlRecord.url);
      expect(response.shortened_url).toBe(newShortUrlRecord.shortened_url);
      expect(response.is_active).toBe(newShortUrlRecord.is_active);
    });
  });

  describe('create', () => {
    it('should return a valid response', async () => {
      const createDto = {
        correlation_id: correlationId,
        domain: domainName,
        url: 'www.google.com',
      };
      const response = await service.create(createDto)
      expect(response).toBeDefined()
      expect(typeof response.is_active).toBe('boolean');
      expect(typeof response.url).toBe('string');
      expect(typeof response.url_hash).toBe('string');
      expect(typeof response.url_id).toBe('number');
      validUrlHash = response.url_hash;
      validShortenedUrl = response.shortened_url;
      validUrl = response.url;
      validUrlId = response.url_id;
    });

    it('should return null when given invalid data', async () => {
      const createDto = {
        correlation_id: correlationId,
        domain: domainName,
        url: 'www.google.com',
      };
      const response = await service.create(createDto)
      expect(response).toBeDefined()
      expect(typeof response.is_active).toBe('boolean');
      expect(typeof response.url).toBe('string');
      expect(typeof response.url_hash).toBe('string');
      expect(typeof response.url_id).toBe('number');
      validUrlHash = response.url_hash;
      validShortenedUrl = response.shortened_url;
      validUrl = response.url;
      validUrlId = response.url_id;
    });

  });

  describe('findById', () => {
    it('should return a valid response with valid url_id', async () => {
      const response = await service.findById(validUrlId)
      expect(response).toBeDefined()
      expect(typeof response.is_active).toBe('boolean');
      expect(typeof response.url).toBe('string');
      expect(typeof response.url_hash).toBe('string');
      expect(typeof response.url_id).toBe('number');
    });

    it('should return null with invalid url_id', async () => {
      const invalidUrlId = 97712;
      const response = await service.findById(invalidUrlId)
      expect(response).toBeNull();
    });
  });

  describe('findByUrlHash', () => {
    it('should return a valid response with valid urlHash', async () => {
      const response = await service.findByUrlHash(validUrlHash)
      expect(response).toBeDefined()
      expect(typeof response.is_active).toBe('boolean');
      expect(typeof response.url).toBe('string');
      expect(typeof response.url_hash).toBe('string');
      expect(typeof response.url_id).toBe('number');
    });

    it('should return null with invalid urlHash', async () => {
      const response = await service.findByUrlHash(invalidUrlHash)
      expect(response).toBeNull();
    });
  });

  describe('findByUrl', () => {
    it('should return a valid response with valid url', async () => {
      const response = await service.findByUrl(validUrl)
      expect(response).toBeDefined()
      expect(typeof response.is_active).toBe('boolean');
      expect(typeof response.url).toBe('string');
      expect(typeof response.url_hash).toBe('string');
      expect(typeof response.url_id).toBe('number');
    });

    it('should return null with invalid url', async () => {
      const response = await service.findByUrl(invalidUrl)
      expect(response).toBeNull();
    });
  });

  describe('update', () => {
    it('should return a valid response when given a valid url hash', async () => {
      const dto = {
        correlation_id: correlationId,
        domain: domainName,
        url_hash: validUrlHash,
      };
      const response = await service.update(dto)
      expect(response).toBeDefined()
      expect(response.message).toBe('success');
      expect(response.url).toBe(validUrl);
      expect(typeof response.shortened_url).toBe('string');
      expect(typeof response.url_hash).toBe('string');
      validUrlHash = response.url_hash
      validShortenedUrl = response.shortened_url;
    });

    it('should return a null when given invalid url hash', async () => {
      const dto = {
        correlation_id: correlationId,
        domain: domainName,
        url_hash: invalidUrlHash,
      };
      const response = await service.update(dto);
      expect(response).toBeNull();
    });

  });

  describe('findAll', () => {
    it('should return exactly one record', async () => {
      const response = await service.findAll()
      expect(response).toHaveLength(1);
    });
  });

  describe('delete', () => {
    it('should return a valid response when given valid url hash', async () => {
      const dto = {
        correlation_id: correlationId,
        url_hash: validUrlHash,
      };
      const response = await service.delete(dto)
      expect(response.message).toBe('success')
      expect(response.shortened_url).toBe(validShortenedUrl)
      expect(response.url).toBe(validUrl)
    });

    it('should return a null when given invalid url hash', async () => {
      const dto = {
        correlation_id: correlationId,
        url_hash: invalidUrlHash,
      };
      const response = await service.delete(dto)
      expect(response).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return 0 records', async () => {
      const response = await service.findAll()
      expect(response).toHaveLength(0);
    });
  });

  afterAll(async () => {
    await getConnection(testConnectionName).close()
  });


});
