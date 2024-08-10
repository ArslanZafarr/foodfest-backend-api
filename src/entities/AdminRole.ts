import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Admin } from "./Admin";
import { Permission } from "./Permission";

@Entity("admin_roles")
export class AdminRole {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  role_name: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @OneToMany(() => Admin, (admin) => admin.role)
  admins: Admin[];

  @ManyToMany(() => Permission)
  @JoinTable({
    name: "role_permissions",
    joinColumn: {
      name: "role_id",
      referencedColumnName: "role_id",
    },
    inverseJoinColumn: {
      name: "permission_id",
      referencedColumnName: "permission_id",
    },
  })
  permissions: Permission[];
}


