import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ShortUrlModule } from './short-url/short-url.module';
import { ShortURLController } from './short-url/short-url.controller';

import { getDBOptions } from './config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(getDBOptions()),
    AuthModule,
    ShortUrlModule,
  ],
  controllers: [ShortURLController],
  providers: [AppService],
})

export class AppModule {
  constructor(private readonly connection: Connection) {}
}

