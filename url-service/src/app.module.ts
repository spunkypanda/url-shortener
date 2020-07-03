import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { DB } from './config'

import { ShortURLController } from './short-url/short-url.controller'
import { ShortUrlModule } from './short-url/short-url.module'

const typeOrmImport = TypeOrmModule.forRoot(DB)

@Module({
  imports: [
    ConfigModule.forRoot(),
    typeOrmImport, 
    ShortUrlModule,
  ],
  controllers: [AppController, ShortURLController],
  providers: [AppService],
})


export class AppModule {
  constructor(private readonly connection: Connection) {}
}
