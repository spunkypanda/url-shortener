import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestLogService } from './request-log/request-log.service';

import { getDBOptions } from './config'
import { RequestLogModule } from './request-log/request-log.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(getDBOptions()),
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
