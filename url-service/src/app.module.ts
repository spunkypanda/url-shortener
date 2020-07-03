import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { getDBOptions } from './config'

import { ShortURLController } from './short-url/short-url.controller'
import { ShortUrlModule } from './short-url/short-url.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(getDBOptions()),
    ShortUrlModule,
  ],
  controllers: [AppController, ShortURLController],
  providers: [AppService],
})


export class AppModule {
  constructor(private readonly connection: Connection) {}
}
