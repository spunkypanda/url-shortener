import { IsEmail, IsNotEmpty } from 'class-validator';

export class loginDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ always: true })
  readonly password: string;
}

export class authDto {
  @IsNotEmpty({ always: true })
  readonly host: string;

  @IsNotEmpty({ always: true })
  readonly secret: string;
}

export class registerDto {
  @IsNotEmpty({ always: true })
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty({ always: true })
  password: string;

  @IsNotEmpty({ always: true })
  host: string;
}