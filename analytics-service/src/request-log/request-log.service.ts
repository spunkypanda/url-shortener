import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'

import { RequestEntity } from './request-log.entity';
import { createRequestDto } from './request-log.dto';

@Injectable()
export class RequestLogService {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
  ) {}

  async create(correlationId: string, actionName: string, dto: Partial<createRequestDto>): Promise<RequestEntity> {
    const requestRecord = new RequestEntity();
    requestRecord.correlation_id = correlationId;
    requestRecord.action = actionName;
    requestRecord.url = dto.url;
    requestRecord.headers = dto.headers;
    requestRecord.body = dto.body;
    requestRecord.query = dto.query;
    requestRecord.response = dto.response;
    requestRecord.status_code = dto.status_code;
    return this.requestRepository.save(requestRecord);
  }

}
