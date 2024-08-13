import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
  } from "typeorm";
  import { User } from "./User";
import { RestaurantTiming } from "./RestaurantTiming";
import { RestaurantRating } from "./RestaurantRating";
import { RestaurantTags } from "./RestaurantTags";
import { RestaurantCuisines } from "./RestaurantCuisines";
import { Menu } from "./Menu";

  
  @Entity("restaurants")
  export class Restaurant {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "varchar", length: 100 })
    name: string;
  
    @Column({ type: "text", nullable: true })
    description: string;
  
    @Column({ type: "varchar", length: 15, unique: true })
    phone_number: string;
  
    @Column({ type: "varchar", length: 100, unique: true, nullable: true })
    email: string;
  
    @Column({ type: "text" })
    address: string;
  
    @Column({ type: "varchar", length: 15, nullable: true })
    restaurant_contact_phone: string;
  
    @Column({ type: "varchar", length: 100, nullable: true })
    owner_fullname: string;
  
    @Column({ type: "varchar", length: 100, nullable: true })
    owner_email: string;
  
    @Column({ type: "varchar", length: 15, nullable: true })
    owner_phone: string;
  
    @Column({ type: "decimal", precision: 9, scale: 6, nullable: true })
    latitude: number;
  
    @Column({ type: "decimal", precision: 9, scale: 6, nullable: true })
    longitude: number;
  
    @Column({ type: "boolean", default: false })
    is_verified: boolean;
  
    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;
  
    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;
  
    @ManyToOne(() => User, (user) => user.restaurants, { onDelete: "CASCADE" })
    user: User;
  
    @OneToMany(() => RestaurantTiming, (timing) => timing.restaurant)
    timings: RestaurantTiming[];
  
    @OneToMany(() => RestaurantRating, (rating) => rating.restaurant)
    ratings: RestaurantRating[];
  
    @OneToMany(() => RestaurantTags, (tag) => tag.restaurant)
    tags: RestaurantTags[];
  
    @OneToMany(() => RestaurantCuisines, (cuisine) => cuisine.restaurant)
    cuisines: RestaurantCuisines[];
  
    @OneToMany(() => Menu, (menu) => menu.restaurant)
    menus: Menu[];
  }
  