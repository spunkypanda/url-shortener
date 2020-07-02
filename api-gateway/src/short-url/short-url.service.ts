import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm'
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { ClientOptions, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { generate as generateShortID } from 'shortid';

import { ShortURLEntity, ShortURLEntityDAO } from './short-url.entity';
import { UpdateURLRecordDAO, DeleteURLRecordDAO } from './short-url.interface';
import { CreateShortUrlDTO } from './short-url.dto';

@Injectable()
export class ShortURLService {
  private clientProxy: ClientProxy
  private maxRetryCount: number = 3; 
  private whitelabelHost: string = "www.chinmay.com";

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

  private getShortURL = (host: string, urlHash: string): string => {
    return `http://${host}/${urlHash}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private isDuplicateUrl = (urlHash: string ): boolean => {
  // const isDuplicateUrl = async (urlHash: string ): Promise<boolean> => {
    return false
  }

  private getURLHash = (retryCount: number, skipDuplicateCheck = false): string => {
    if (retryCount == 0) return null
    const urlHash = generateShortID()
    if (!skipDuplicateCheck && this.isDuplicateUrl(urlHash)) return this.getURLHash(retryCount-1) 
    return generateShortID()
  };

  async ping(){
    return this.clientProxy.send<number, string>('ping', 'chinmay')
  }

  private buildShortUrlRO(shortURLRecord: ShortURLEntity) {
    const shortUrlRO = {
      url_id: shortURLRecord.url_id,
      url: shortURLRecord.url,
      url_hash: shortURLRecord.url_hash,
      shortened_url: shortURLRecord.shortened_url,
      is_active: shortURLRecord.is_active,
    };

    return shortUrlRO;
  }

  async findAll(): Promise<ShortURLEntity[]> {
    return await this.shortUrlRepository.find();
  }

  async findByUrlHash(urlHash: string) {
    return this.clientProxy.send<ShortURLEntity, string>('links:get', urlHash);
  }

  async create(url: string) {
    return this.clientProxy.send<ShortURLEntityDAO, string>('links:create', url);
  }

  async update(urlHash: string) {
    return this.clientProxy.send<UpdateURLRecordDAO, string>('links:update', urlHash);
  }

  async delete(urlHash: string) {
    console.log('urlHash:', urlHash);
    return this.clientProxy.send<DeleteURLRecordDAO, string>('links:delete', urlHash);
  }
}
