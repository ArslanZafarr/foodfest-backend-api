import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { Restaurant } from "./Restaurant";
  import { MenuItem } from "./MenuItem";
  
  @Entity("menus")
  export class Menu {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "varchar", length: 100 })
    name: string;
  
    @Column({ type: "text", nullable: true })
    description: string;
  
    @Column({ type: "boolean", default: true })
    is_available: boolean;
  
    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;
  
    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;
  
    @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus, {
      onDelete: "CASCADE",
    })
    restaurant: Restaurant;
  
    @OneToMany(() => MenuItem, (item) => item.menu)
    items: MenuItem[];
  }
  