import * as path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DB: Partial<TypeOrmModuleOptions> = {
  type: 'postgres', 
  name: 'default', 
  port: 5432,
  host: 'localhost', 
  username: 'chinmay', 
  password: 'chinmay', 
  database: 'shorten', 
  schema: 'public', 
  synchronize: true,
  logging: false,
  entities: [path.join(__dirname, "..", "**/*.entity{.ts,.js}")],
};
