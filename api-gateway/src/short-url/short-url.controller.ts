import { Controller, UseGuards, CanActivate, Response, Body, Get, Param, ParamData, Post, Delete, Put, HttpCode, Logger } from '@nestjs/common';
import { ExecutionContext, Injectable, CallHandler, NestInterceptor, NestMiddleware, UseInterceptors } from '@nestjs/common';
import { Response as ResponseBody } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';

import { ShortURLService } from './short-url.service';
import { ShortenedURLDAO, CreateURLRecordDTO, UpdateURLRecordDTO, GetURLRecordDTO } from './short-url.interface';
import { AuthGuard } from 'src/app.controller';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): any {
    return next.handle();
  }
}

@ApiBearerAuth()
@ApiTags('short_url')
@Controller()
export class ShortURLController {
  private readonly urlDoesntExistExceptionError: Record<string, any> =  { message: 'Url does not exist.' };
  private readonly urlDoesntExistException: HttpException = new HttpException(this.urlDoesntExistExceptionError, HttpStatus.NOT_FOUND);

  constructor(private readonly shortUrlService: ShortURLService) {}

  @Get('ping')
  @UseInterceptors(LoggingInterceptor)
  // @UseInterceptors(AnalyticsInterceptor)
  async getHello(): Promise<string> {
    return this.shortUrlService.ping();
  }

  @Post('links')
  @UseGuards(AuthGuard)
  // @UseGuards(AuthGuard('local'))
  @UseInterceptors(LoggingInterceptor)
  // @UseInterceptors(AnalyticsInterceptor)
  async createShortenedURL(@Body() body: Readonly<CreateURLRecordDTO>): Promise<Partial<ShortenedURLDAO>> {
    const createDTO = {
      url: body.url,
    };
    return this.shortUrlService.create(createDTO);
  }

  @Get('links/:url_hash')
  @UseInterceptors(LoggingInterceptor)
  async getShortenedURL(
    @Param() params: Readonly<GetURLRecordDTO>,
    @Response() res: ResponseBody,
  ): Promise<any> {
    const shortUrlRecord = await this.shortUrlService.findByUrlHash(params.url_hash);
    if (!shortUrlRecord) throw this.urlDoesntExistException;
    // res.status(HttpStatus.FOUND);
    // res.setHeader('Location', shortUrlRecord.url);
    // return res.json(shortUrlRecord)
    return res.redirect(shortUrlRecord.url)
  }

  @Put('links/:url_hash')
  @UseGuards(AuthGuard)
  @UseInterceptors(LoggingInterceptor)
  async updateShortenedURL(@Param() params: Readonly<UpdateURLRecordDTO>): Promise<any> {
    const updatedRecord = await this.shortUrlService.update(params.url_hash);
    if (!updatedRecord) throw this.urlDoesntExistException;

    return updatedRecord;
  }

  @Delete('links/:url_hash')
  @UseGuards(AuthGuard)
  @UseInterceptors(LoggingInterceptor)
  async deleteShortenedURL(@Param() params: Readonly<GetURLRecordDTO>): Promise<any> {
    const deletedRecord = await this.shortUrlService.delete(params.url_hash);
    if (!deletedRecord) throw this.urlDoesntExistException;

    return deletedRecord
  }
}
