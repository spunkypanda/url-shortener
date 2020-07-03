import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('requests')
export class RequestEntity {
  @PrimaryGeneratedColumn()
  request_id: string; 

  @Column()
  correlation_id: string; 

  @Column()
  action: string; 

  @Column()
  url: string; 

  @Column({ nullable: true, type: "json", default: {} })
  headers: Record<string, unknown>; 

  @Column({ nullable: true, type: "json", default: {} })
  body: Record<string, unknown>;
  
  @Column({ nullable: true, type: "json", default: {} })
  query: Record<string, unknown>;

  @Column({ type: "timestamp without time zone", default: new Date() })
  timestamp: Date;  
}

