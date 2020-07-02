import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';

import { AppModule } from './app.module';

async function bootstrap() {
  const appOptions = {cors: true};
  const app = await NestFactory.create(AppModule, appOptions);
  app.use(compression());

  const port = parseInt(process.env.PORT) || 8080;
  await app.listen(port);
}

bootstrap();

