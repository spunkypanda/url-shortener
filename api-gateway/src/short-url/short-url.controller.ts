import { Controller, UseGuards, Response, Body, Get, Param, Post, Delete, Put, Req, Headers  } from '@nestjs/common';
import { ExecutionContext, Injectable, CallHandler, NestInterceptor } from '@nestjs/common';
import { Response as ResponseBody, Request as RequestBody } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';

import { ShortURLService } from './short-url.service';
import { CreateURLRecordDTO, UpdateURLRecordDTO, GetURLRecordDTO } from './short-url.interface';
import { CreateRequestDto } from './short-url.dto';
import { AuthGuard } from 'src/app.controller';
import { ClientOptions, Transport, ClientProxyFactory, ClientProxy } from '@nestjs/microservices';

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
  private clientProxy: ClientProxy;

  private readonly urlDoesntExistExceptionError: Record<string, any> =  { message: 'Url does not exist.' };
  private readonly urlDoesntExistException: HttpException = new HttpException(this.urlDoesntExistExceptionError, HttpStatus.NOT_FOUND);

  constructor(private readonly shortUrlService: ShortURLService) {

    const microserviceOptions: ClientOptions = {
      transport: Transport.TCP,
      options: {
        host: process.env.ANALYTICS_SERVICE_HOST,
        port: parseInt(process.env.ANALYTICS_SERVICE_PORT),
      }
    };
    this.clientProxy = ClientProxyFactory.create(microserviceOptions);

  }

  async logRequest(request: RequestBody, actionName: string, callback: Function) {
    const headers = request.headers;
    const body = {};
    const query = {};

    const createRequestDto: CreateRequestDto = {
      correlation_id: String(request.headers['X-Correlation-Id']),
      action: actionName,
      url: request.url,
      headers,
      body,
      query,
    };

    const obs =  this.clientProxy.send<any, Record<string, any>>('log:request', createRequestDto)
    return obs.subscribe(() => callback());
  }


  @Get('ping/url')
  async getHello() {
    return this.shortUrlService.ping();
  }

  @Post('links')
  @UseGuards(AuthGuard)
  async createShortenedURL(@Headers() header: Record<string, string>, @Body() body: Readonly<CreateURLRecordDTO>) {
    const correlationId:string = header['correlation_id'];
    const domain:string = header['domain'];
    return this.shortUrlService.create(correlationId, domain, body.url);
  }

  @Get('links/:url_hash')
  async getShortenedURL(
    @Param() params: Readonly<GetURLRecordDTO>,
    @Req() req: RequestBody,
    @Response() res: ResponseBody,
  ) {
    const result = await this.shortUrlService.findByUrlHash(params.url_hash)

    return result.subscribe(async (result) => {
      if (!result) {
        await this.logRequest(req, 'LINK_FAILED', () => {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json(this.urlDoesntExistExceptionError);
        })
      }
      await this.logRequest(req, 'LINK_FOUND', () => {
        return res.redirect(result.url)
      });
    });

  }

  @Put('links/:url_hash')
  @UseGuards(AuthGuard)
  async updateShortenedURL(@Headers() header: Record<string, string>, @Param() params: Readonly<UpdateURLRecordDTO>): Promise<any> {
    const correlationId:string = header['correlation_id'];
    const domain:string = header['domain'];
    const updatedRecord = await this.shortUrlService.update(correlationId, domain, params.url_hash);
    if (!updatedRecord) throw this.urlDoesntExistException;
    return updatedRecord;
  }

  @Delete('links/:url_hash')
  @UseGuards(AuthGuard)
  async deleteShortenedURL(@Headers() header: Record<string, string>, @Param() params: Readonly<GetURLRecordDTO>): Promise<any> {
    const correlationId:string = header['correlation_id'];
    // const domain:string = header['domain'];
    const deletedRecord = await this.shortUrlService.delete(correlationId, params.url_hash);
    if (!deletedRecord) throw this.urlDoesntExistException;

    return deletedRecord
  }
}
