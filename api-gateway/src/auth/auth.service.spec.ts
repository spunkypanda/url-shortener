import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserEntity } from './auth.entity';
import { Repository, createConnection, getConnection, getRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { authDto, loginDto, registerDto } from './auth.dto';

describe('AuthService', () => {
  let service: AuthService;
  const testConnectionName = 'default';
  const validUserRecord: Partial<registerDto> = {};

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
          {
            provide: getRepositoryToken(UserEntity),
            useClass: Repository,
          }
      ],
    }).compile();


    let connection = await createConnection({
      type: "postgres",
      database: "shorten",
      dropSchema: true,
      entities: [UserEntity],
      synchronize: true,
      logging: false,
      name: testConnectionName,
    });    

    const repository = getRepository(UserEntity, testConnectionName);
    service = new AuthService(repository);
    return connection
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('create', () => {
    it('should be defined', async () => {
      const dto: registerDto = {
        email: '',
        name: '',
        password: '',
        host: '',
      };
      const res = await service.create(dto);
      expect(res).toBeDefined();

      validUserRecord.name = res.name;
      validUserRecord.email = res.email;
      validUserRecord.password = dto.password;
      validUserRecord.host = res.host;
    });

  });

  describe('findUserByEmailPassword', () => {
    it('should return valid response', async () => {
      const dto: loginDto = {
        email: validUserRecord.email,
        password: validUserRecord.password,
      };
      const res = await service.findUserByEmailPassword(dto);
      expect(res).toBeDefined();
    });
  });

  describe('generateUserSecret', () => {
    it('should return valid response', async () => {
      const secret = await service.generateUserSecret()
      expect(secret).toBe('secretsecretsecret');
    });
  });


  describe('findUserByHostSecret', () => {
    it('should return valid response', async () => {
      const secret = await service.generateUserSecret()
      const dto: authDto = {
        host: validUserRecord.host,
        secret,
      };
      const res = await service.findUserByHostSecret(dto);
      expect(res).toBeDefined();
    });
  });


  afterAll(async () => {
    await getConnection(testConnectionName).close()
  });

});
