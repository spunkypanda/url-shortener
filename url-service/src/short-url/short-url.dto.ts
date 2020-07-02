import { IsNotEmpty } from 'class-validator';

export class CreateShortUrlDTO {
  @IsNotEmpty()
  readonly url: string;

  @IsNotEmpty()
  readonly url_hash: string;
}

export class UpdateShortUrlDTO {
  @IsNotEmpty()
  readonly url: string;

  @IsNotEmpty()
  readonly url_hash: string;
}