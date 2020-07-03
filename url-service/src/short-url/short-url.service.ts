import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm'
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { generate as generateShortID } from 'shortid';
import { validate } from 'class-validator';

import { ShortURLEntity, ShortURLEntityDAO } from './short-url.entity';
import { UpdateURLRecordDAO, DeleteURLRecordDAO } from './short-url.interface';
import { CreateShortUrlDTO, UpdateShortUrlDTO, DeleteShortUrlDTO } from './short-url.dto';

@Injectable()
export class ShortURLService {

  private maxRetryCount: number = 3; 

  constructor(
    @InjectRepository(ShortURLEntity)
    private readonly shortUrlRepository: Repository<ShortURLEntity>,
  ) {}

  private getShortURL = (host: string, urlHash: string): string => {
    return `http://${host}/${urlHash}`;
  }

  // Prevent duplicates
  private async isDuplicateUrlHash(urlHash: string ): Promise<boolean> {
    const shortURLRecord = await getRepository(ShortURLEntity).findOne({ is_active: true, url_hash: urlHash });
    if (shortURLRecord) return true;
    return false;
  }

  private async getURLHash(retryCount: number, skipDuplicateCheck = false): Promise<string> {
    if (retryCount == 0) return null
    const urlHash = generateShortID()
    // if (!skipDuplicateCheck && this.isDuplicateUrlHash(urlHash)) return this.getURLHash(retryCount-1, skipDuplicateCheck) 

    if (!skipDuplicateCheck) {
      const isDuplicate = await this.isDuplicateUrlHash(urlHash)
      if (isDuplicate) return this.getURLHash(retryCount-1, skipDuplicateCheck) 
    }
    return urlHash;
  };

  async ping(): Promise<string> {
    return 'Pong!';
  }

  buildShortUrlRO(shortURLRecord: ShortURLEntity) {
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
    return await this.shortUrlRepository.find({ is_active: true });
  }

  async findById(shortUrlId: number): Promise<ShortURLEntityDAO>{
    const shortUrlRecord = await this.shortUrlRepository.findOne(shortUrlId);
    
    if (!shortUrlRecord) return null;

    return this.buildShortUrlRO(shortUrlRecord);
  }

  async findByUrl(url: string): Promise<ShortURLEntityDAO>{
    const qb = await getRepository(ShortURLEntity)
      .createQueryBuilder('short_url')
      .where('short_url.url = :url AND is_active = true ', { url });

    const shortUrlRecord = await qb.getOne();
    if (!shortUrlRecord) return null;

    return this.buildShortUrlRO(shortUrlRecord);
  }

  async findByUrlHash(urlHash: string): Promise<ShortURLEntityDAO>{
    const qb = await getRepository(ShortURLEntity)
      .createQueryBuilder('short_url')
      .where('short_url.url_hash = :urlHash AND is_active = true ', { urlHash });

    const shortUrlRecord = await qb.getOne();
    if (!shortUrlRecord) return null;

    return this.buildShortUrlRO(shortUrlRecord);
  }

  async create(dto: CreateShortUrlDTO): Promise<ShortURLEntityDAO> {
    const shortURLRecord = await this.shortUrlRepository.findOne({ is_active: true, url: dto.url });
    if (shortURLRecord) {
      return shortURLRecord;
    }

    const urlHash = await this.getURLHash(this.maxRetryCount);
    const shortUrl =  this.getShortURL(dto.domain, urlHash);

    const newShortUrlRecord = new ShortURLEntity();
    newShortUrlRecord.url = dto.url;
    newShortUrlRecord.url_hash = urlHash;
    newShortUrlRecord.shortened_url = shortUrl;

    const savedPipeline = await this.shortUrlRepository.save(newShortUrlRecord);
    return this.buildShortUrlRO(savedPipeline);
  }

  async update(updateShortUrlDTO: UpdateShortUrlDTO): Promise<UpdateURLRecordDAO> {
    const toUpdate = await this.findByUrlHash(updateShortUrlDTO.url_hash);
    if (!toUpdate) return null;

    const newURLHash = await this.getURLHash(this.maxRetryCount);
    const shortUrl =  this.getShortURL(updateShortUrlDTO.domain, newURLHash);
    const updateDTO = {
      url_hash: newURLHash,
      shortened_url: shortUrl,
    };

    const updated = Object.assign(toUpdate, updateDTO);
    const res = await this.shortUrlRepository.save(updated);
    return ({
      message: 'success',
      url: res.url,
      url_hash: newURLHash,
      shortened_url: res.shortened_url,
    });
  }

  async delete(deleteShortUrlDTO: DeleteShortUrlDTO): Promise<DeleteURLRecordDAO> {
    const existingUrlRecord = await this.findByUrlHash(deleteShortUrlDTO.url_hash);
    if (!existingUrlRecord) {
      return null;
    }
    const updated = Object.assign(existingUrlRecord, {is_active: false});
    const res = await this.shortUrlRepository.save(updated);
    return ({
      message: 'success',
      url: res.url,
      shortened_url: res.shortened_url,
    });
  }
}
