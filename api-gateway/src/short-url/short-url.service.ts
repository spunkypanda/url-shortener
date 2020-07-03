import { Injectable, HttpException, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { ClientOptions, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

import { ShortURLEntity, ShortURLEntityDAO } from './short-url.entity';
import { UpdateURLRecordDAO, DeleteURLRecordDAO } from './short-url.interface';
import { CreateShortUrlDTO, UpdateShortUrlDTO, DeleteShortUrlDTO } from './short-url.dto';
import { domain } from 'process';
import { validate } from 'class-validator';

@Injectable()
export class ShortURLService {
  private clientProxy: ClientProxy

  constructor(
    @InjectRepository(ShortURLEntity)
    private readonly shortUrlRepository: Repository<ShortURLEntity>,
  ) {
    const microserviceOptions: ClientOptions = {
      transport: Transport.TCP,
      options: {
        host: process.env.URL_SERVICE_HOST,
        port: parseInt(process.env.URL_SERVICE_PORT),
      }
    };
    this.clientProxy = ClientProxyFactory.create(microserviceOptions);
  }

  async ping(){
    return this.clientProxy.send<number, string>('ping', 'chinmay')
  }

  async findAll(): Promise<ShortURLEntity[]> {
    return await this.shortUrlRepository.find();
  }

  async findByUrlHash(urlHash: string) {
    return this.clientProxy.send<ShortURLEntity, string>('links:get', urlHash);
  }

  async create(correlationId: string, domain: string, url: string) {
    const createShortUrlDTO: Partial<CreateShortUrlDTO> = {
      correlation_id: correlationId,
      domain: domain,
      url: url,
    };

    return this.clientProxy.send<ShortURLEntityDAO, Partial<CreateShortUrlDTO>>('links:create', createShortUrlDTO);
  }

  async update(correlationId: string, domain: string, urlHash: string) {
    const updateShortUrlDTO: UpdateShortUrlDTO = {
      correlation_id: correlationId,
      domain: domain,
      url_hash: urlHash,
    };

    const errors = await validate(updateShortUrlDTO)
    if (errors.length) {
      const [error] = errors;
      throw new HttpException(error.constraints, HttpStatus.BAD_REQUEST);
    }

    return this.clientProxy.send<UpdateURLRecordDAO, UpdateShortUrlDTO>('links:update', updateShortUrlDTO);
  }

  async delete(correlationId: string, urlHash: string) {
    const deleteShortUrlDTO: DeleteShortUrlDTO = {
      correlation_id: correlationId,
      url_hash: urlHash,
    };
    return this.clientProxy.send<DeleteURLRecordDAO, DeleteShortUrlDTO>('links:delete', deleteShortUrlDTO);
  }
}
