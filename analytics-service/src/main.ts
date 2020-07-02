import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

const logger = new Logger('Analytics');

const microserviceOptions = {
  transport: Transport.TCP,
  options: {
    host: '127.0.0.1',
    port: 4000,
  }
};

async function bootstrap() {

  const app = await NestFactory.createMicroservice(AppModule, microserviceOptions);
  await app.listen(() => {
    logger.log("Microservice is listening")
  });
}
bootstrap();
