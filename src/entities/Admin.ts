import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { User } from './User';
  import { AdminRole } from './AdminRole';
  
  @Entity('admins')
  export class Admin {
    @PrimaryGeneratedColumn()
    admin_id: number;
  
    @ManyToOne(() => User, user => user.admins)
    user: User;
  
    @ManyToOne(() => AdminRole, role => role.admins)
    role: AdminRole;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
  }
  