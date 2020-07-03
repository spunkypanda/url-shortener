import { Injectable, HttpException, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { ClientOptions, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { validate } from 'class-validator';

import { ShortURLEntity, ShortURLEntityDao } from './entities/short-url.entity';
import { UpdateURLRecordDao, DeleteURLRecordDao } from './short-url.interface';
import { CreateShortUrlDto, UpdateShortUrlDto, DeleteShortUrlDto } from './dto';

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
    const createShortUrlDto: Partial<CreateShortUrlDto> = {
      correlation_id: correlationId,
      domain: domain,
      url: url,
    };

    return this.clientProxy.send<ShortURLEntityDao, Partial<CreateShortUrlDto>>('links:create', createShortUrlDto);
  }

  async update(correlationId: string, domain: string, urlHash: string) {
    const updateShortUrlDto: UpdateShortUrlDto = {
      correlation_id: correlationId,
      domain: domain,
      url_hash: urlHash,
    };

    const errors = await validate(updateShortUrlDto)
    if (errors.length) {
      const [error] = errors;
      throw new HttpException(error.constraints, HttpStatus.BAD_REQUEST);
    }

    return this.clientProxy.send<UpdateURLRecordDao, UpdateShortUrlDto>('links:update', updateShortUrlDto);
  }

  async delete(correlationId: string, urlHash: string) {
    const deleteShortUrlDto: DeleteShortUrlDto = {
      correlation_id: correlationId,
      url_hash: urlHash,
    };
    return this.clientProxy.send<DeleteURLRecordDao, DeleteShortUrlDto>('links:delete', deleteShortUrlDto);
  }
}
