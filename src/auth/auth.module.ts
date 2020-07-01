import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { UserEntity } from './auth.entity';
import { AuthController } from './auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [AuthService],
  controllers: [
    AuthController,
  ],
  exports: [AuthService]
})

export class AuthModule {
  constructor(private readonly authService: AuthService) {}
}

