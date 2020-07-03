import * as path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getDBOptions(): Partial<TypeOrmModuleOptions> {
  return ({
    type: 'postgres', 
    port: parseInt(process.env.DB_PORT),
    host: process.env.DB_HOST,
    schema: process.env.DB_SCHEMA,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    synchronize: true,
    logging: false,
    entities: [path.join(__dirname, "..", "**/*.entity{.ts,.js}")],
  });
}
