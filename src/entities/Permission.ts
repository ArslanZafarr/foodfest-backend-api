import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToMany,
  } from 'typeorm';
  import { AdminRole } from './AdminRole';
  
  @Entity('permissions')
  export class Permission {
    @PrimaryGeneratedColumn()
    permission_id: number;
  
    @Column({ type: 'varchar', length: 50, unique: true })
    permission_name: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
  
    @ManyToMany(() => AdminRole, role => role.permissions)
    roles: AdminRole[];
  }
  