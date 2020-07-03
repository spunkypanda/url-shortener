import { Logger, Injectable, NestMiddleware } from "@nestjs/common";
import { ShortURLEntity } from "src/short-url/short-url.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/auth/auth.entity";

interface DecodedHostAndSecret {
  host: string,
  secret: string,
}

/*
const options = {
  headerName: 'authorization',
  // bodyName: 'authorization',
  // queryName: 'authorization'
};

const authenticate = (token: string, done: Function) => {
  logger.log(`Token :: ${token}`)
  return done(null, 'chinmay', { scope: 'all' });
};

passport.use('api-bearer', new CustomBearerStrategy(options, authenticate))

passport.authenticate('api-bearer', (err, user, info) => {
  const authorizationHeader = headers['authorization'];
  logger.log(`Authorization Header:: ${authorizationHeader}`);

  next();
})

*/

const logger = new Logger('Auth:Middleware');

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  extractFromAuthToken(authorizationHeader: string): DecodedHostAndSecret {
    const authString = authorizationHeader.split('Bearer ')[1];
    const [authStringHost, authStringSecret] = authString.split(':');
    return ({
      host: authStringHost,
      secret: authStringSecret,
    });
  }

  async use(request: Request, response: Response, next: Function) {   // eslint-disable-line @typescript-eslint/ban-types
    const headers = request.headers;
    const method = request.method;
    if (method == 'GET') return next();

    const authorizationHeader = headers['authorization'];
    if (!authorizationHeader) return next();

    logger.log(`Authorization Header:: ${authorizationHeader}`);
    const decodedHostAndSecret = this.extractFromAuthToken(authorizationHeader);

    const qb = this.userRepository
      .createQueryBuilder('users')
      .where(
        'users.host = :host AND users.secret = :secret AND is_active = true ',
        decodedHostAndSecret,
      );

    const userRecord = await qb.getOne();
    if (!userRecord) return next();

    request.headers['userId'] = userRecord.user_id;
    request.headers['domain'] = userRecord.host;
    request.headers['whitelabelHost'] = decodedHostAndSecret.host;
    request.headers['whitelabelSecret'] = decodedHostAndSecret.secret;
    return next();
  }
}
