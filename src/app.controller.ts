import { Controller, UseGuards, UseInterceptors, Body, Get, Param, Post, Delete, Put } from '@nestjs/common';
import { ExecutionContext, Injectable, CanActivate, CallHandler, NestInterceptor, NestMiddleware } from '@nestjs/common';

import { AppService } from './app.service';
import { ShortenedURLDAO } from './short-url/url.interface';
import { CreateURLRecordDTO, GetURLRecordDTO } from './short-url/url.interface';

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

    // console.log('ip addr:', request.ip);
    console.log('headers::user-agent:', userAgent);
    console.log('mode:', mode);
    console.log('host:', host);
    console.log('referrer:', referrer);
    console.log('referrerPolicy:', referrerPolicy);
    console.log('redirect:', redirect);
    console.log('credentials:', credentials);

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

    // console.log('IP:', ip);
    console.log('headers::user-agent:', userAgent);
    console.log('mode:', mode);
    console.log('host:', host);
    console.log('referrer:', referrer);
    console.log('referrerPolicy:', referrerPolicy);
    console.log('redirect:', redirect);
    console.log('credentials:', credentials);

    console.log();

    return next();
  }
}


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(LoggingInterceptor)
  @UseInterceptors(AnalyticsInterceptor)
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Post('links')
  // @UseGuards(AuthGuard)
  @UseInterceptors(LoggingInterceptor)
  @UseInterceptors(AnalyticsInterceptor)
  async createShortenedURL(@Body() body: Readonly<CreateURLRecordDTO>): Promise<ShortenedURLDAO> {
    return this.appService.createShortenedURLService(body.url);
  }

  @Get('links/:url_hash')
  async getShortenedURL(@Param() params: Readonly<GetURLRecordDTO>): Promise<string> {
    return this.appService.getShortenedURLService(params.url_hash);
  }

  @Put('links')
  @UseGuards(AuthGuard)
  @UseInterceptors(LoggingInterceptor)
  async updateShortenedURL(@Body() body: Readonly<CreateURLRecordDTO>): Promise<ShortenedURLDAO> {
    return this.appService.updateShortenedURLService(body.url);
  }

  @Delete('links/:url_hash')
  @UseGuards(AuthGuard)
  async deleteShortenedURL(@Param() params: Readonly<GetURLRecordDTO>): Promise<string> {
    return this.appService.deleteShortenedURLService(params.url_hash);
  }
}
