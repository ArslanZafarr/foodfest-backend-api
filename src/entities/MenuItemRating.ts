import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { MenuItem } from "./MenuItem";
import { User } from "./User";

@Entity("menu_item_ratings")
export class MenuItemRating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.ratings, {
    onDelete: "CASCADE",
  })
  menuItem: MenuItem;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @Column({ type: "int", width: 1 })
  rating: number;

  @Column({ type: "text", nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;
}
