import { IsNotEmpty } from 'class-validator';

export class loginDto {
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}

export class authDto {
  @IsNotEmpty()
  readonly host: string;

  @IsNotEmpty()
  readonly secret: string;
}

export class registerDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  host: string;
}