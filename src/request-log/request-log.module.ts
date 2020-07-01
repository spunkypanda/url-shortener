import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestLogService } from './request-log.service';
import { RequestEntity } from './request-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity])],
  providers: [RequestLogService],
  exports: [RequestLogService],
})
export class RequestLogModule {
  constructor(private readonly requestLogService: RequestLogService) {}
}



