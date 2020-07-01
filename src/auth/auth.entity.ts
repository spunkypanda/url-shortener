import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  user_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  host: string;

  @Column()
  secret: string;

  @Column({ default: true })
  is_active: boolean;
}
