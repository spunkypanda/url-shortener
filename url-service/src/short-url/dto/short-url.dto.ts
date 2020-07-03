import { IsNotEmpty } from 'class-validator';

export class GetShortUrlDto {
  constructor(dto) {
    this.correlation_id = dto.correlation_id;
    this.url = dto.url;
    this.domain = dto.domain;
  }

  @IsNotEmpty({ always: true })
  url: string;

  @IsNotEmpty({ always: true })
  correlation_id: string;

  @IsNotEmpty({ always: true })
  domain: string;
}


export class CreateShortUrlDto {
  constructor(dto) {
    this.correlation_id = dto.correlation_id;
    this.url = dto.url;
    this.domain = dto.domain;
  }

  @IsNotEmpty({ always: true })
  url: string;

  @IsNotEmpty({ always: true })
  correlation_id: string;

  @IsNotEmpty({ always: true })
  domain: string;
}

export class UpdateShortUrlDto {
  constructor(dto) {
    this.correlation_id = dto.correlation_id;
    this.url_hash = dto.url_hash;
    this.domain = dto.domain;
  }


  @IsNotEmpty({ always: true })
  readonly url_hash: string;

  @IsNotEmpty({ always: true })
  readonly correlation_id: string;

  @IsNotEmpty({ always: true })
  readonly domain: string;
}

export class DeleteShortUrlDto {
  constructor(dto) {
    this.correlation_id = dto.correlation_id;
    this.url_hash = dto.url_hash;
  }

  @IsNotEmpty({ always: true })
  readonly url_hash: string;

  @IsNotEmpty({ always: true })
  readonly correlation_id: string;
}
