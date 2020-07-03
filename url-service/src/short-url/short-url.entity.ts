import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
// import { IsNotEmpty } from 'class-validator';

@Entity('short_url')
export class ShortURLEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  url_id: number;

  @Column()
  url: string;

  @Column()
  url_hash: string;

  @Column()
  shortened_url: string;

  @Column({ default: true })
  is_active: boolean;
}

export type ShortURLEntityDAO = Partial<ShortURLEntity>