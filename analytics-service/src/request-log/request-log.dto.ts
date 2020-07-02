import { IsNotEmpty } from 'class-validator';

export class createRequestDto {
  @IsNotEmpty()
  readonly correlation_id: string; 

  @IsNotEmpty()
  readonly action: string; 

  @IsNotEmpty()
  readonly url: string; 

  @IsNotEmpty()
  readonly headers: Record<string, unknown>; 

  @IsNotEmpty()
  readonly body: Record<string, unknown>;
  
  @IsNotEmpty()
  readonly query: Record<string, unknown>;
  
  @IsNotEmpty()
  readonly response: Record<string, unknown>; 

  @IsNotEmpty()
  readonly status_code: number;  

  timestamp: Date;  
}


