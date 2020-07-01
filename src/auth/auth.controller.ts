import { Controller, Body, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { loginDto, registerDto } from './auth.dto';
// import { userDAO } from './auth.interface';

import {
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('auth')
@Controller()
export class ShortURLController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: Readonly<loginDto>): Promise<any> {
  // async login(@Body() body: Readonly<loginDto>): Promise<userDAO> {
    // const createDTO = {
    //   url: body.url,
    // };
    return "bye";
  }

  @Post('key')
  async generateKey(@Body() body: Readonly<loginDto>): Promise<any> {
  // async login(@Body() body: Readonly<loginDto>): Promise<userDAO> {
    // const createDTO = {
    //   url: body.url,
    // };
    return "bye";
  }

  @Post('register')
  async registerUser(@Body() body: Readonly<registerDto>): Promise<any> {
  // async registerUser(@Body() body: Readonly<registerDto>): Promise<userDAO> {
    // const createDTO = {
    //   url: body.url,
    // };
    return "bye";
  }
}
