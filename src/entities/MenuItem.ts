import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
  } from "typeorm";
import { Menu } from "./Menu";
import { Category } from "./Category";
import { MenuItemImage } from "./MenuItemImage";
import { MenuItemRating } from "./MenuItemRating";
  
  @Entity("menu_items")
  export class MenuItem {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Menu, (menu) => menu.items, { onDelete: "CASCADE" })
    menu: Menu;
  
    @ManyToOne(() => Category, (category) => category.menuItems)
    category: Category;
  
    @Column({ type: "varchar", length: 100 })
    name: string;
  
    @Column({ type: "text", nullable: true })
    description: string;
  
    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;
  
    @CreateDateColumn()
    created_at: Date;
  
    @OneToMany(() => MenuItemImage, (image) => image.menuItem)
    images: MenuItemImage[];
  
    @OneToMany(() => MenuItemRating, (rating) => rating.menuItem)
    ratings: MenuItemRating[];
  }
  