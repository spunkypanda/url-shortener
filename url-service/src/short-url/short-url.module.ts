import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { ShortURLService } from './short-url.service';
import { ShortURLEntity } from './entities/short-url.entity';
import { ShortURLController } from './short-url.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([ShortURLEntity]),
  ],
  providers: [ShortURLService],
  controllers: [
    ShortURLController,
  ],
  exports: [ShortURLService]
})


export class ShortUrlModule {
  constructor(private readonly shortUrlService: ShortURLService) {}
}
