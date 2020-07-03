import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity('short_url')
export class ShortURLEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  url_id: number;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false })
  url_hash: string;

  @Column({ nullable: false })
  shortened_url: string;

  @Column({ default: true })
  is_active: boolean;
}

export type ShortURLEntityDao = Partial<ShortURLEntity>