import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { PassportModule } from '@nestjs/passport';

import { ShortURLService } from './short-url.service';
import { ShortURLEntity } from './short-url.entity';
import { ShortURLController } from './short-url.controller';

@Module({
  imports: [
    // TypeOrmModule.forFeature([UserEntity]),
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
