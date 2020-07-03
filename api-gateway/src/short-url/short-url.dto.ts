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

export interface CreateRequestDto {
  correlation_id: string; 
  action: string; 
  url: string; 
  headers: Record<string, any>; 
  body: Record<string, any>;
  query: Record<string, any>;
  response?: Record<string, any>; 
  status_code?: number;  
  timestamp?: Date;  
}
