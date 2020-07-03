import { Controller, Body, Post, Response } from '@nestjs/common';
import { Response as ResponseBody } from 'express';

import { AuthService } from './auth.service';
import { loginDto, registerDto } from './auth.dto';
import { UserDao } from './auth.interface';

import {
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SuccessResponse } from 'src/shared/response.dto';

@ApiBearerAuth()
@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: Readonly<loginDto>,
    @Response() res: ResponseBody,
  ) {
    const response = await this.authService.findUserByEmailPassword(body)
    return res.json(new SuccessResponse(response))
  }

  @Post('register')
  async registerUser(
    @Body() body: Readonly<registerDto>,
    @Response() res: ResponseBody,
  ) {
    const response = await this.authService.create(body)
    return res.json(new SuccessResponse(response))
  }
}
