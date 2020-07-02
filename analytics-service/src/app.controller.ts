import { Controller, Logger } from '@nestjs/common';
import { ClientOptions, MessagePattern, Transport } from '@nestjs/microservices';

import { AppService } from './app.service';

const microserviceOptions: ClientOptions = {
  transport: Transport.TCP,
  options: {
    host: '127.0.0.1',
    port: 4000,
  }
};

@Controller()
export class AppController {
  private logger: Logger

  constructor(private readonly appService: AppService) {
    this.logger = new Logger('Analytics')
  }

  @MessagePattern('hello')
  getHello(name:string): string {
    this.logger.log(`Received name: ${name}`);
    return this.appService.getHello(name);
  }
}
