import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Profile } from "./Profile";
import { UserHasRole } from "./UserHasRole";
import { Restaurant } from "./Restaurant";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: "varchar", length: 50 })
  username: string;

  @Column({ type: "varchar", length: 100 })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password_hash: string;

  @Column({ type: "varchar", length: 15 })
  phone_number: string;

  @Column({ type: "text", nullable: true })
  refresh_token: string | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  @JoinColumn()
  profile: Profile;

  @OneToOne(() => UserHasRole, (userHasRole) => userHasRole.user)
  userHasRole: UserHasRole;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.user)
  restaurants: Restaurant[];
}
