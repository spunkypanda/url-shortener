import { Controller, Body, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { loginDto, registerDto } from './auth.dto';
import { userDAO } from './auth.interface';

import {
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: Readonly<loginDto>): Promise<userDAO> {
    return this.authService.findUserByEmailPassword(body)
  }

  @Post('register')
  async registerUser(@Body() body: Readonly<registerDto>): Promise<userDAO> {
    return this.authService.create(body)
  }
}
