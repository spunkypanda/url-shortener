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

  @Column("json")
  headers: Record<string, unknown>; 

  @Column("json")
  body: Record<string, unknown>;
  
  @Column("json")
  query: Record<string, unknown>;
  
  @Column("json")
  response: Record<string, unknown>; 

  @Column()
  status_code: number;  

  @Column("timestamp without time zone")
  timestamp: Date;  
}

