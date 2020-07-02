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

  @Column({ type: "json", default: {} })
  headers: Record<string, unknown>; 

  @Column({ type: "json", default: {} })
  body: Record<string, unknown>;
  
  @Column({ type: "json", default: {} })
  query: Record<string, unknown>;
  
  @Column({ type: "json", default: {} })
  response: Record<string, unknown>; 

  @Column()
  status_code: number;  

  @Column({ type: "timestamp without time zone", default: new Date() })
  timestamp: Date;  
}

