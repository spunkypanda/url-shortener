import { Controller, UseGuards, UseInterceptors, Body, Get, Param, Post, Delete, Put } from '@nestjs/common';
import { ExecutionContext, Injectable, CanActivate, CallHandler, NestInterceptor, NestMiddleware } from '@nestjs/common';

import { ShortURLService } from './short-url.service';
import { ShortenedURLDAO, CreateURLRecordDTO, UpdateURLRecordDTO, GetURLRecordDTO } from './short-url.interface';

import {
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization']
    // Authorization: `Bearer ${whitelabelHost}:${whitelabelSecret}`
    if (!authorizationHeader) {
      return false;
    }
    return true;
  }
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): any {
    return next.handle();
  }
}

// Store user-agent, http headers, time, ip, referrer of short link visitor for analytical
// purposes and any other data you identify as required.

@Injectable()
export class AnalyticsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): any {
    const request: Request = context.switchToHttp().getRequest();

    const headers = request.headers;
    const referrer = request.referrer;
    const referrerPolicy = request.referrerPolicy;
    const redirect = request.redirect;
    const credentials = request.credentials;
    const userAgent = headers['user-agent'];
    const host = headers['host'];
    const mode = request.mode;

    console.log();
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log('user-agent:', userAgent);
    console.log('mode:', mode);
    console.log('host:', host);
    console.log('referrer:', referrer);
    console.log('referrerPolicy:', referrerPolicy);
    console.log('redirect:', redirect);
    console.log('credentials:', credentials);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log();

    // user-agent, http headers, time, ip, referrer
    return next.handle();
  }
}

@Injectable()
export class AnalyticsMiddleware implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  use(request: Request, response: Response, next: Function) {   // eslint-disable-line @typescript-eslint/ban-types
    const headers = request.headers;

    // const ip = request.ip;
    const referrer = request.referrer;
    const referrerPolicy = request.referrerPolicy;
    const redirect = request.redirect;
    const credentials = request.credentials;
    const userAgent = headers['user-agent'];
    const host = headers['host'];
    const mode = request.mode;

    console.log();
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    // console.log('IP:', ip);
    console.log('user-agent:', userAgent);
    console.log('mode:', mode);
    console.log('host:', host);
    console.log('referrer:', referrer);
    console.log('referrerPolicy:', referrerPolicy);
    console.log('redirect:', redirect);
    console.log('credentials:', credentials);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log();

    return next();
  }
}

@ApiBearerAuth()
@ApiTags('short_url')
@Controller()
export class ShortURLController {
  constructor(private readonly shortUrlService: ShortURLService) {}

  @Get()
  @UseInterceptors(LoggingInterceptor)
  @UseInterceptors(AnalyticsInterceptor)
  async getHello(): Promise<string> {
    return this.shortUrlService.getHello();
  }

  @Post('links')
  // @UseGuards(AuthGuard)
  @UseInterceptors(LoggingInterceptor)
  @UseInterceptors(AnalyticsInterceptor)
  async createShortenedURL(@Body() body: Readonly<CreateURLRecordDTO>): Promise<Partial<ShortenedURLDAO>> {
    const createDTO = {
      url: body.url,
    };
    return this.shortUrlService.create(createDTO);
  }

  @Get('links/:url_hash')
  @UseInterceptors(LoggingInterceptor)
  @UseInterceptors(AnalyticsInterceptor)
  async getShortenedURL(@Param() params: Readonly<GetURLRecordDTO>): Promise<any> {
    return this.shortUrlService.findByUrlHash(params.url_hash);
  }

  @Put('links/:url_hash')
  // @UseGuards(AuthGuard)
  @UseInterceptors(LoggingInterceptor)
  @UseInterceptors(AnalyticsInterceptor)
  async updateShortenedURL(@Param() params: Readonly<UpdateURLRecordDTO>): Promise<any> {
    return this.shortUrlService.update(params.url_hash);
  }

  @Delete('links/:url_hash')
  // @UseGuards(AuthGuard)
  @UseInterceptors(LoggingInterceptor)
  @UseInterceptors(AnalyticsInterceptor)
  async deleteShortenedURL(@Param() params: Readonly<GetURLRecordDTO>): Promise<any> {
    return this.shortUrlService.delete(params.url_hash);
  }
}
