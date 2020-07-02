import { Test, TestingModule } from '@nestjs/testing';
import { ShortURLService } from './short-url.service';
import { Repository, createConnection, getConnection, getRepository, DeleteResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShortURLEntity } from './short-url.entity';

describe.only('ShortURLService', () => {
  let service: ShortURLService;
  const testConnectionName = 'default';

  let validUrlId: number;
  let validUrl: string;
  let validUrlHash: string;
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
      const response = await service.getHello()
      expect(response).toBe('Pong!')
    });
  });

  describe('create', () => {
    it('should return a valid response', async () => {
      const createDto = {
        url: 'www.google.com',
      };
      const response = await service.create(createDto)
      expect(response).toBeDefined()
      expect(typeof response.is_active).toBe('boolean');
      expect(typeof response.url).toBe('string');
      expect(typeof response.url_hash).toBe('string');
      expect(typeof response.url_id).toBe('number');
      validUrlHash = response.url_hash;
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
    it('should return a valid response', async () => {
      const response = await service.update(validUrlHash)
      expect(response).toBeDefined()
      expect(response.message).toBe('success');
      expect(typeof response.url).toBe('string');
      expect(typeof response.shortened_url).toBe('string');
      expect(typeof response.url_hash).toBe('string');
      validUrlHash = response.url_hash
    });
  });

  describe('delete', () => {
    it('should return a valid response', async () => {
      const response = await service.delete(validUrlHash)
      // expect(response).toBeInstanceOf(DeleteResult)
      expect(response.message).toBe('success')
    });
  });

  afterAll(async () => {
    await getConnection(testConnectionName).close()
  });


});
