import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity('expired_tokens')
  export class ExpiredToken {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'text' })
    token: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
  }
  