import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserEntity } from './auth.entity';
import { Repository, createConnection, getConnection, getRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
          {
            provide: getRepositoryToken(UserEntity),
            useClass: Repository,
          }
      ],
    }).compile();


    const testConnectionName = 'default';

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
});
