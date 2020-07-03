import { Controller, Logger, BadRequestException, Catch, RpcExceptionFilter, ArgumentsHost, UseFilters } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { validate } from 'class-validator';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';

import { ShortURLService } from './short-url.service';
import { ShortenedURLDao } from './short-url.interface';
import { CreateShortUrlDto, UpdateShortUrlDto, DeleteShortUrlDto } from './dto';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    return throwError(exception.getError());
  }
}

@ApiBearerAuth()
@ApiTags('short_url')
@Controller()
export class ShortURLController {
  private readonly urlDoesntExistExceptionError: string = 'Url does not exist.';
  private readonly urlDoesntExistException: RpcException = new RpcException(this.urlDoesntExistExceptionError);
  private logger: Logger

  constructor(private readonly shortUrlService: ShortURLService) {
    this.logger = new Logger('URL') 
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('ping')
  async getHello(name:string) {
    this.logger.log(`Received name: ${name}`);
    return this.shortUrlService.ping();
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('links:create')
  async createShortenedURL(createShortUrlDto: CreateShortUrlDto): Promise<Partial<ShortenedURLDao>> {
    this.logger.log(`url: ${createShortUrlDto.url}`);
    const dto = new CreateShortUrlDto(createShortUrlDto)

    const validatorOptions: ValidatorOptions = {
      skipMissingProperties: false,
      forbidUnknownValues: true,
      validationError: { target: false },
    };
    const errors = await validate(dto, validatorOptions);
    if (errors.length) {
      const [error] = errors;
      throw new RpcException(error.constraints.isNotEmpty);
    }
    const resp = await this.shortUrlService.create(createShortUrlDto);
    return resp
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('links:get')
  async getShortenedURL(urlHash: string): Promise<any> {
    this.logger.log(`urlHash: ${urlHash}`);
    return this.shortUrlService.findByUrlHash(urlHash);
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('links:update')
  async updateShortenedURL(updateShortUrlDto: UpdateShortUrlDto): Promise<any> {
    const dto = new UpdateShortUrlDto(updateShortUrlDto)

    const validatorOptions: ValidatorOptions = {
      skipMissingProperties: false,
      forbidUnknownValues: true,
      validationError: { target: false },
    };
    const errors = await validate(dto, validatorOptions);
    if (errors.length) {
      const [error] = errors;
      throw new RpcException(error.constraints.isNotEmpty);
    }
    const updatedRecord = await this.shortUrlService.update(updateShortUrlDto);
    if (!updatedRecord) throw this.urlDoesntExistException;
    return updatedRecord;
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('links:delete')
  async deleteShortenedURL(deleteShortUrlDto: DeleteShortUrlDto): Promise<any> {
    const dto = new DeleteShortUrlDto(deleteShortUrlDto)

    const validatorOptions: ValidatorOptions = {
      skipMissingProperties: false,
      forbidUnknownValues: true,
      validationError: { target: false },
    };
    const errors = await validate(dto, validatorOptions);
    if (errors.length) {
      const [error] = errors;
      throw new RpcException(error.constraints.isNotEmpty);
    }
    const deletedRecord = await this.shortUrlService.delete(deleteShortUrlDto);
    console.log("###", deletedRecord);
    if (!deletedRecord) throw this.urlDoesntExistException;
    return deletedRecord;
  }
}
