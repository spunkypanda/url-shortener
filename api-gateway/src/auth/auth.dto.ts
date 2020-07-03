import { IsEmail, IsNotEmpty } from 'class-validator';

export class loginDto {
  @IsEmail()
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

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  host: string;
}