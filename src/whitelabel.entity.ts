import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('whitelabel')
export class Whitelabel {
  @PrimaryColumn()
  whitelabel_id: string;

  @Column()
  whitelabel_name: string;

  @Column()
  whitelabel_host: string;

  @Column()
  whitelabel_secret: string;

  @Column({ default: true })
  is_active: boolean;
}
