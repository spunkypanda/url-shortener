import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';

import { ClientProxyFactory, ClientOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function bootstrap() {
  const appOptions = {cors: true};
  const app = await NestFactory.create(AppModule, appOptions);
  app.use(compression());

  const port = parseInt(process.env.PORT) || 8080;
  await app.listen(port);
}

const microserviceOptions: ClientOptions = {
  transport: Transport.TCP,
  options: {
    host: '127.0.0.1',
    port: 4000,
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function bootstrapMicroservices() {
  const client  = ClientProxyFactory.create(microserviceOptions);
  client
  .send<string, string>('hello', 'chinmay')
  .subscribe(result => console.log('result', result))
}

async function init() {
  await bootstrap();
  await bootstrapMicroservices();
}

init()

