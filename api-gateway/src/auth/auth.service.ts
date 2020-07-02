import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm'
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';

import { UserEntity } from './auth.entity';
import { userDAO } from './auth.interface';
import { loginDto, registerDto, authDto } from './auth.dto';

const generateUserSecret = (): string => {
  return 'secretsecretsecret';
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private buildUserRO(user: UserEntity): userDAO {
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

  async findUserByEmailPassword(dto: loginDto): Promise<userDAO> {
    const qb = await getRepository(UserEntity)
      .createQueryBuilder('users')
      .where('users.email = :email AND users.password = :password AND is_active = true ', dto);

    const userRecord = await qb.getOne();

    if (!userRecord) {
      const _errors = { message: "User doesn't exist" };
      throw new HttpException(_errors, HttpStatus.BAD_REQUEST);
    }

    return this.buildUserRO(userRecord);
  }

  async findUserByHostSecret(dto: authDto): Promise<userDAO> {
    const qb = await getRepository(UserEntity)
      .createQueryBuilder('users')
      .where('users.host = :host AND users.secret = :secret AND is_active = true ', dto);

    const userRecord = await qb.getOne();

    if (!userRecord) {
      const _errors = { message: "User doesn't exist" };
      throw new HttpException(_errors, HttpStatus.BAD_REQUEST);
    }

    return this.buildUserRO(userRecord);
  }


  async create(dto: registerDto): Promise<userDAO> {
    const qb = await getRepository(UserEntity)
      .createQueryBuilder('users')
      .where('users.email = :email AND is_active = true ', dto);

    const existingUserRecord = await qb.getOne();

    if (existingUserRecord) {
      const _errors = { message: 'User email must be unique' };
      throw new HttpException(_errors, HttpStatus.BAD_REQUEST);
    }

    const userRecord = new UserEntity();
    userRecord.name = dto.name;
    userRecord.email = dto.email;
    userRecord.host = dto.host;
    userRecord.password = dto.password;
    userRecord.secret = generateUserSecret();

    const savedPipeline = await this.userRepository.save(userRecord);
    return this.buildUserRO(savedPipeline);
  }

}
