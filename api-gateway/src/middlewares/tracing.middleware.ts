import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import * as uuid from "uuid";
import { ClientProxy, ClientProxyFactory, ClientOptions, Transport } from "@nestjs/microservices";

import { CreateRequestDto } from '../short-url/short-url.dto';
import { RequestEntity } from '../short-url/entities';

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  private logger: Logger;
  private clientProxy: ClientProxy;
  private linkQueriedActionName: string = 'LINK_QUERIED';

  constructor() {
    this.logger = new Logger('TracingMiddleware');

    const microserviceOptions: ClientOptions = {
      transport: Transport.TCP,
      options: {
        host: process.env.ANALYTICS_SERVICE_HOST,
        port: parseInt(process.env.ANALYTICS_SERVICE_PORT),
      }
    };
    this.clientProxy = ClientProxyFactory.create(microserviceOptions);
  }

  generateUUID(): string {
    return uuid.v4()
  }

  async logRequest(request: Request) {
    const headers = request.headers;
    const body = {};
    const query = {};
    // const query = new URL(request.url).search;
    // const query = myURL.searchParams;

    const createRequestDto: CreateRequestDto = {
      correlation_id: request.headers['X-Correlation-Id'],
      action: this.linkQueriedActionName,
      url: request.url,
      headers,
      body,
      query,
    };

    return this.clientProxy.send<RequestEntity, CreateRequestDto>('log:request', createRequestDto)
  }

  async use(request: Request, response: Response, next: Function) {   // eslint-disable-line @typescript-eslint/ban-types
    const correlationId = this.generateUUID();
    this.logger.log(`X-Correlation-Id :: ${correlationId}`)
    request.headers['X-Correlation-Id'] = correlationId;
    // await this.logRequest(request);
    if (request.method == 'GET') {
      const result = await this.logRequest(request);
      await result.toPromise()
    }
    return next();
  }
}
