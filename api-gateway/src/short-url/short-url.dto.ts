import { IsNotEmpty } from 'class-validator';

export class CreateShortUrlDto {
  @IsNotEmpty({ always: true })
  readonly url: string;

  readonly correlation_id: string;

  readonly domain: string;
}

export class UpdateShortUrlDto {
  @IsNotEmpty({ always: true })
  readonly url_hash: string;

  readonly correlation_id: string;

  readonly domain: string;
}

export class DeleteShortUrlDto {
  @IsNotEmpty({ always: true })
  readonly url_hash: string;

  readonly correlation_id: string;
}

export interface CreateRequestDto {
  correlation_id: string; 
  action: string; 
  url: string; 
  headers: Record<string, any>; 
  body: Record<string, any>;
  query: Record<string, any>;
  response?: Record<string, any>; 
  timestamp?: Date;  
}
