import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { LinkCreatedCommand } from './commands/link-created.command';
import { LinkQueriedCommand } from './commands/link-queried.command';
import { LinkFoundCommand } from './commands/link-found.command';
import { LinkFailedCommand } from './commands/link-failed.command';


import { LinkCreatedDto, LinkQueriedDto, LinkFoundDto, LinkFailedDto } from './dto'

@Injectable()
export class AppService {
  // constructor(private commandBus: CommandBus) {}

  sayHello(name: string): string {
    return `Hello ${name}!`;
  }

  /*
  async linkCreated(urlId: string, linkCreatedDto: LinkCreatedDto) {
    return this.commandBus.execute(
      new LinkCreatedCommand(urlId)
    );
  }

  async linkQueried(urlId: string, linkQueriedDto: LinkQueriedDto) {
    return this.commandBus.execute(
      new LinkCreatedCommand(urlId)
    );
  }

  async linkFound(urlId: string, linkFoundDto: LinkFoundDto) {
    return this.commandBus.execute(
      new LinkFoundCommand(urlId)
    );
  }

  async linkFailed(urlId: string, linkFailedDto: LinkFailedDto) {
    return this.commandBus.execute(
      new LinkFailedCommand(urlId)
    );
  }
  */
}
