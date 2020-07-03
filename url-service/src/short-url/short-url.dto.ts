import { IsNotEmpty } from 'class-validator';

export class CreateShortUrlDTO {
  @IsNotEmpty()
  readonly url: string;

  readonly correlation_id: string;
  readonly domain: string;
}

export class UpdateShortUrlDTO {
  @IsNotEmpty()
  readonly url_hash: string;

  readonly correlation_id: string;
  readonly domain: string;
}

export class DeleteShortUrlDTO {
  @IsNotEmpty()
  readonly url_hash: string;

  readonly correlation_id: string;
}
