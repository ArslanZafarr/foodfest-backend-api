import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from "typeorm";
  import { Restaurant } from "./Restaurant";
  
  @Entity("restaurant_cuisines")
  export class RestaurantCuisines {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "varchar", length: 50 })
    cuisine_name: string;
  
    @ManyToOne(() => Restaurant, (restaurant) => restaurant.cuisines, {
      onDelete: "CASCADE",
    })
    restaurant: Restaurant;
  }
  