import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from "typeorm";
  import { MenuItem } from "./MenuItem";
  
  @Entity("categories")
  export class Category {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "varchar", length: 100 })
    name: string;
  
    @OneToMany(() => MenuItem, (menuItem) => menuItem.category)
    menuItems: MenuItem[];
  }
  