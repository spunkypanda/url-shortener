import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestLogService } from './request-log/request-log.service';

import { DB } from './config'
import { RequestLogModule } from './request-log/request-log.module';

const typeOrmImport = TypeOrmModule.forRoot(DB)

@Module({
  imports: [
    ConfigModule.forRoot(),
    typeOrmImport, 
    RequestLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    private readonly appService: AppService,
    private readonly requestLogService: RequestLogService
  ) {}
}
