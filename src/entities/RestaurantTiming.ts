import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { Restaurant } from "./Restaurant";
  
  @Entity("restaurant_timings")
  export class RestaurantTiming {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Restaurant, (restaurant) => restaurant.timings, {
      onDelete: "CASCADE",
    })
    @JoinColumn({ name: "restaurant_id" })
    restaurant: Restaurant;
  
    @Column({ type: "varchar", length: 20 })
    day_of_week: string;
  
    @Column({ type: "time" })
    open_time: string;
  
    @Column({ type: "time" })
    close_time: string;
  }
  