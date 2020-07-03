import { Controller, Logger } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ShortURLService } from './short-url.service';
import { ShortenedURLDAO } from './short-url.interface';
import { CreateShortUrlDTO, UpdateShortUrlDTO, DeleteShortUrlDTO } from './short-url.dto';

@ApiBearerAuth()
@ApiTags('short_url')
@Controller()
export class ShortURLController {
  private readonly urlDoesntExistExceptionError: Record<string, any> =  { message: 'Url does not exist.' };
  private readonly urlDoesntExistException: HttpException = new HttpException(this.urlDoesntExistExceptionError, HttpStatus.NOT_FOUND);
  private logger: Logger

  constructor(private readonly shortUrlService: ShortURLService) {
    this.logger = new Logger('URL') 
  }

  @MessagePattern('ping')
  async getHello(name:string) {
    this.logger.log(`Received name: ${name}`);
    return this.shortUrlService.ping();
  }

  @MessagePattern('links:create')
  async createShortenedURL(createShortUrlDTO: CreateShortUrlDTO): Promise<Partial<ShortenedURLDAO>> {
    this.logger.log(`url: ${createShortUrlDTO.url}`);
    return this.shortUrlService.create(createShortUrlDTO);
  }

  @MessagePattern('links:get')
  async getShortenedURL(urlHash: string): Promise<any> {
    this.logger.log(`urlHash: ${urlHash}`);
    return this.shortUrlService.findByUrlHash(urlHash);
  }

  @MessagePattern('links:update')
  async updateShortenedURL(updateShortUrlDTO: UpdateShortUrlDTO): Promise<any> {
    this.logger.log(`urlHash: ${updateShortUrlDTO.url_hash}`);
    const updatedRecord = await this.shortUrlService.update(updateShortUrlDTO);
    if (!updatedRecord) throw this.urlDoesntExistException;
    return updatedRecord;
  }

  @MessagePattern('links:delete')
  async deleteShortenedURL(deleteShortUrlDTO: DeleteShortUrlDTO): Promise<any> {
    this.logger.log(`urlHash: ${deleteShortUrlDTO.url_hash}`);
    const deletedRecord = await this.shortUrlService.delete(deleteShortUrlDTO);
    if (!deletedRecord) throw this.urlDoesntExistException;
    return deletedRecord
  }
}
