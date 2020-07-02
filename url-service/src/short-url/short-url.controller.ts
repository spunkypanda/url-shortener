import { Controller, UseGuards, CanActivate, Response, Body, Get, Param, ParamData, Post, Delete, Put, HttpCode, Logger } from '@nestjs/common';
import { ExecutionContext, Injectable, CallHandler, NestInterceptor, NestMiddleware, UseInterceptors } from '@nestjs/common';
import { Response as ResponseBody } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { ClientOptions, MessagePattern, Transport } from '@nestjs/microservices';

import { ShortURLService } from './short-url.service';
import { ShortenedURLDAO } from './short-url.interface';
// import { AuthGuard } from 'src/app.controller';

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
  async createShortenedURL(url: string): Promise<Partial<ShortenedURLDAO>> {
    this.logger.log(`url: ${url}`);
    const createDTO = { url };
    return this.shortUrlService.create(createDTO);
  }

  @MessagePattern('links:get')
  async getShortenedURL(urlHash: string): Promise<any> {
    this.logger.log(`urlHash: ${urlHash}`);
    return this.shortUrlService.findByUrlHash(urlHash);
  }

  @MessagePattern('links:update')
  async updateShortenedURL(urlHash: string): Promise<any> {
    this.logger.log(`urlHash: ${urlHash}`);
    const updatedRecord = await this.shortUrlService.update(urlHash);
    if (!updatedRecord) throw this.urlDoesntExistException;
    return updatedRecord;
  }

  @MessagePattern('links:delete')
  async deleteShortenedURL(urlHash: string): Promise<any> {
    this.logger.log(`urlHash: ${urlHash}`);
    const deletedRecord = await this.shortUrlService.delete(urlHash);
    if (!deletedRecord) throw this.urlDoesntExistException;
    return deletedRecord
  }
}
