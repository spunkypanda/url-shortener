import { IsNotEmpty } from 'class-validator';

export class CreateShortUrlDTO {
  @IsNotEmpty()
  readonly url: string;

  readonly url_hash: string;
}

export class UpdateShortUrlDTO {
  @IsNotEmpty()
  readonly url: string;

  @IsNotEmpty()
  readonly url_hash: string;
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
