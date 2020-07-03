import { Controller, UseGuards, Response, Body, Get, Param, Post, Delete, Put } from '@nestjs/common';
import { Req, Headers, UseFilters, Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ExecutionContext, Injectable, CallHandler, NestInterceptor } from '@nestjs/common';
import { Response as ResponseBody, Request as RequestBody, response } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';

import { ShortURLService } from './short-url.service';
import { CreateURLRecordDto, UpdateURLRecordDto, GetURLRecordDto } from './short-url.interface';
import { CreateRequestDto } from './short-url.dto';
import { AuthGuard } from 'src/app.controller';
import { ClientOptions, Transport, ClientProxyFactory, ClientProxy } from '@nestjs/microservices';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): any {
    return next.handle();
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ResponseBody>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    response
      .status(status)
      .json({ message });
  }
}


@ApiBearerAuth()
@ApiTags('short_url')
@Controller()
export class ShortURLController {
  private clientProxy: ClientProxy;
  private defaultWhitelabelHost: string;

  private linkCreatedActionName: string = 'LINK_CREATED';
  private linkFailedActionName: string = 'LINK_FAILED';
  private linkFoundActionName: string = 'LINK_FOUND';

  private readonly urlDoesntExistExceptionError: string =  'Url does not exist.';
  private readonly urlDoesntExistException: HttpException = new HttpException(this.urlDoesntExistExceptionError, HttpStatus.NOT_FOUND);

  constructor(private readonly shortUrlService: ShortURLService) {
    this.defaultWhitelabelHost = process.env.WHITELABEL_HOST;

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
    const query = {};

    const createRequestDto: CreateRequestDto = {
      correlation_id: String(request.headers['X-Correlation-Id']),
      action: actionName,
      url: request.url,
      headers,
      body: request.body,
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
  @UseFilters(HttpExceptionFilter)
  async createShortenedURL(
    @Req() req: RequestBody,
    @Response() res: ResponseBody,
    @Headers() header: Record<string, string>,
    @Body() body: Readonly<CreateURLRecordDto>
  ) {
    const correlationId:string = header['X-Correlation-Id'];
    const domain:string = this.defaultWhitelabelHost || header['domain'];
    const result = await this.shortUrlService.create(correlationId, domain, body.url);

    try {
      const response = await result.toPromise();
      this.logRequest(req, this.linkCreatedActionName, () =>  res.json(response));
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('links/:url_hash')
  @UseFilters(HttpExceptionFilter)
  async getShortenedURL(
    @Param() params: Readonly<GetURLRecordDto>,
    @Req() req: RequestBody,
    @Response() res: ResponseBody,
  ) {
    const result = await this.shortUrlService.findByUrlHash(params.url_hash)

    try {
      const response = await result.toPromise()
      if (!response) {
        await this.logRequest(req, this.linkFailedActionName, () => {
          throw this.urlDoesntExistException;
        });
      }
      return res.redirect(response.url);
    } catch (error) {
      console.log("###", error.message)
      throw this.urlDoesntExistException;
      // throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }

    /*
    return result.subscribe(async (result) => {
      if (!result) {
        await this.logRequest(req, this.linkFailedActionName, () => {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json(this.urlDoesntExistExceptionError);
        })
      }
      await this.logRequest(req, this.linkFoundActionName, () => {
        return res.redirect(result.url)
      });
    });
    */
  }

  @Put('links/:url_hash')
  @UseGuards(AuthGuard)
  @UseFilters(HttpExceptionFilter)
  async updateShortenedURL(
    @Req() req: RequestBody,
    @Response() res: ResponseBody,
    @Headers() header: Record<string, string>,
    @Param() params: Readonly<UpdateURLRecordDto>
  ): Promise<any> {
    const correlationId:string = header['X-Correlation-Id'];
    const domain:string = this.defaultWhitelabelHost || header['domain'];
    const result = await this.shortUrlService.update(correlationId, domain, params.url_hash);
    try {
      const response = await result.toPromise();
      this.logRequest(req, this.linkCreatedActionName, () => res.json(response));
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
    // if (!updatedRecord) throw this.urlDoesntExistException;
    // return updatedRecord;
  }

  @Delete('links/:url_hash')
  @UseGuards(AuthGuard)
  @UseFilters(HttpExceptionFilter)
  async deleteShortenedURL(
    @Req() req: RequestBody,
    @Response() res: ResponseBody,
    @Headers() header: Record<string, string>,
    @Param() params: Readonly<GetURLRecordDto>
  ): Promise<any> {
    const correlationId:string = header['X-Correlation-Id'];
    // const domain:string = header['domain'];
    const result = await this.shortUrlService.delete(correlationId, params.url_hash);
    try {
      const response = await result.toPromise();
      this.logRequest(req, this.linkCreatedActionName, () => res.json(response));
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }
}
