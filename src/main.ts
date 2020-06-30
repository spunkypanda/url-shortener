import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const appOptions = {cors: true};
  const app = await NestFactory.create(AppModule, appOptions);

  const port = parseInt(process.env.PORT) || 8080;
  await app.listen(port);
}
bootstrap();
