import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TracingMiddleware } from '../middlewares/tracing.middleware';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ShortURLService } from './short-url.service';
import { ShortURLEntity } from './entities/short-url.entity';
import { ShortURLController } from './short-url.controller';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from 'src/auth/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([ShortURLEntity]),
  ],
  providers: [AuthService, ShortURLService],
  controllers: [
    ShortURLController,
  ],
  exports: [ShortURLService]
})


export class ShortUrlModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TracingMiddleware)
      .forRoutes(ShortURLController)
      .apply(AuthMiddleware)
      .exclude({ path: 'links/*', method: RequestMethod.GET })
      .forRoutes(ShortURLController);
  }

  constructor(private readonly shortUrlService: ShortURLService) {}
}
