import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
          
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestLogService } from './request-log/request-log.service';
import { RequestEntity } from './request-log/request-log.entity';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        RequestLogService,
        {
          provide: getRepositoryToken(RequestEntity),
          useClass: Repository,
        },
        AppService,
      
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      expect(await appController.getHello('Chinmay')).toBe('Hello Chinmay!');
    });
  });
});
