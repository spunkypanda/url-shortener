import { CanActivate, Logger } from '@nestjs/common';
import { ExecutionContext, Injectable } from '@nestjs/common';

const logger = new Logger('Auth:Guard');

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization']
    const userId = request.headers['userId']
    if (!authorizationHeader || !userId) {
      return false;
    }

    const whitelabelHost = request.headers['whitelabelHost'];
    const whitelabelSecret = request.headers['whitelabelSecret'];
    logger.log(`whitelabelHost: ${whitelabelHost}`);
    logger.log(`whitelabelSecret: ${ whitelabelSecret}`);
    logger.log(`userId: ${userId}`);
    return true;
  }
}