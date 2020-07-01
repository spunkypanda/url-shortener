import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

// import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ShortUrlModule } from './short-url/short-url.module';
import { ShortURLController } from './short-url/short-url.controller';

import { DB } from './config'
import { RequestLogModule } from './request-log/request-log.module';

const typeOrmImport = TypeOrmModule.forRoot(DB)

@Module({
  imports: [
    ConfigModule.forRoot(),
    typeOrmImport, 
    AuthModule,
    ShortUrlModule,
    RequestLogModule,
  ],
  controllers: [ShortURLController],
  providers: [AppService],
})

export class AppModule {
  constructor(private readonly connection: Connection) {}
}

