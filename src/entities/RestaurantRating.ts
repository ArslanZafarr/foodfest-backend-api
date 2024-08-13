import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Restaurant } from "./Restaurant";
import { User } from "./User";

@Entity("restaurant_ratings")
export class RestaurantRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", width: 1 })
  rating: number;

  @Column({ type: "text", nullable: true })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.ratings, {
    onDelete: "CASCADE",
  })
  restaurant: Restaurant;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;
}
