import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

const logger = new Logger('Analytics');

const microserviceOptions = {
  transport: Transport.TCP,
  options: {
    host: process.env.ANALYTICS_SERVICE_HOST,
    port: parseInt(process.env.ANALYTICS_SERVICE_PORT),
  }
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, microserviceOptions);
  await app.listen(() => {
    logger.log("Analytics Service is listening...")
  });
}
bootstrap();
