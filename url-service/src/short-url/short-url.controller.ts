import { Controller, Logger, BadRequestException, Catch, RpcExceptionFilter, ArgumentsHost, UseFilters } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

import { ShortURLService } from './short-url.service';
import { ShortenedURLDAO } from './short-url.interface';
import { CreateShortUrlDTO, UpdateShortUrlDTO, DeleteShortUrlDTO } from './short-url.dto';
import { validateOrReject, validate, ValidationOptions, ValidationError, isNotEmpty, IsEmpty } from 'class-validator';
import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';


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
  async createShortenedURL(createShortUrlDTO: CreateShortUrlDTO): Promise<Partial<ShortenedURLDAO>> {
    this.logger.log(`url: ${createShortUrlDTO.url}`);
    const dto = new CreateShortUrlDTO(createShortUrlDTO)

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
    const resp = await this.shortUrlService.create(createShortUrlDTO);
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
  async updateShortenedURL(updateShortUrlDTO: UpdateShortUrlDTO): Promise<any> {
    const dto = new UpdateShortUrlDTO(updateShortUrlDTO)

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
    const updatedRecord = await this.shortUrlService.update(updateShortUrlDTO);
    if (!updatedRecord) throw this.urlDoesntExistException;
    return updatedRecord;
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('links:delete')
  async deleteShortenedURL(deleteShortUrlDTO: DeleteShortUrlDTO): Promise<any> {
    const dto = new DeleteShortUrlDTO(deleteShortUrlDTO)

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
    const deletedRecord = await this.shortUrlService.delete(deleteShortUrlDTO);
    console.log("###", deletedRecord);
    if (!deletedRecord) throw this.urlDoesntExistException;
    return deletedRecord;
  }
}
