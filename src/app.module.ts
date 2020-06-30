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

const typeOrmImport = TypeOrmModule.forRoot(DB)

@Module({
  imports: [
    ConfigModule.forRoot(),
    typeOrmImport, 
    AuthModule,
    ShortUrlModule,
  ],
  controllers: [ShortURLController],
  providers: [AppService],
})

export class AppModule {
  constructor(private readonly connection: Connection) {}
}

