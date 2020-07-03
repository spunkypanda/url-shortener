import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm'
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { hashSync, compareSync } from 'bcrypt';

import { UserEntity } from './auth.entity';
import { UserDao } from './auth.interface';
import { loginDto, registerDto, authDto } from './auth.dto';

const generateUserSecret = (): string => {
  return 'secretsecretsecret';
};

@Injectable()
export class AuthService {
  private saltRounds: number = 10;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private buildUserRO(user: UserEntity): UserDao {
    return ({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      host: user.host,
      secret: user.secret,
    })
  }

  async generateUserSecret (): Promise<string> {
    return 'secretsecretsecret';
  }

  async findUserByEmailPassword(dto: loginDto): Promise<UserDao> {
    const userRecord = await this.userRepository.findOne({ email: dto.email, is_active: true });
    if (!userRecord) {
      const _errors = { message: "Invalid email/password" };
      throw new HttpException(_errors, HttpStatus.BAD_REQUEST);
    }

    if (!compareSync(dto.password, userRecord.password)) {
      const _errors = { message: "Invalid email/password" };
      throw new HttpException(_errors, HttpStatus.BAD_REQUEST);
    }

    return this.buildUserRO(userRecord);
  }

  async findUserByHostSecret(dto: authDto): Promise<UserDao> {
    const userRecord = await this.userRepository.findOne({ ...dto, is_active: true });
    if (!userRecord) {
      const _errors = { message: "User doesn't exist" };
      throw new HttpException(_errors, HttpStatus.BAD_REQUEST);
    }

    return this.buildUserRO(userRecord);
  }


  async create(dto: registerDto): Promise<UserDao> {
    const existingUserRecord = await this.userRepository.findOne({ is_active: true, email: dto.email });
    if (existingUserRecord) {
      const _errors = { message: 'User email must be unique' };
      throw new HttpException(_errors, HttpStatus.BAD_REQUEST);
    }

    const passwordHash = hashSync(dto.password, this.saltRounds);

    const userRecord = new UserEntity();
    userRecord.name = dto.name;
    userRecord.email = dto.email;
    userRecord.host = dto.host;
    userRecord.password = passwordHash;
    userRecord.secret = generateUserSecret();

    const savedPipeline = await this.userRepository.save(userRecord);
    return this.buildUserRO(savedPipeline);
  }

}
