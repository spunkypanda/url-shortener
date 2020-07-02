import { Controller, Logger } from '@nestjs/common';
import { ClientOptions, MessagePattern, Transport } from '@nestjs/microservices';

import { AppService } from './app.service';
import { RequestLogService } from './request-log/request-log.service';

@Controller()
export class AppController {
  private logger: Logger

  constructor(
    private readonly appService: AppService,
    private readonly requestService: RequestLogService
  ) {
    this.logger = new Logger('Analytics')
  }

  @MessagePattern('hello')
  async getHello(name:string): Promise<string> {
    this.logger.log(`Received name: ${name}`);
    return this.appService.sayHello(name);
  }

  @MessagePattern('log:request')
  async logRequest(request:Record<string, any>) {
    this.logger.log('log:request');
    this.logger.log(request);
    const correlationId: string = request.correlation_id;
    const actionName: string = request.action;
    const dto: Record<string, any> = {
      action: request.action,
      url: request.url,
      body: request.body,
      query: request.query,
      params: request.params,
    }

    return this.requestService.create(correlationId, actionName, dto)
  }
}
