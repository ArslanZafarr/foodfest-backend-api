import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Restaurant } from "./Restaurant";

@Entity("restaurant_tags")
export class RestaurantTags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50 })
  tag_name: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tags, {
    onDelete: "CASCADE",
  })
  restaurant: Restaurant;
}
