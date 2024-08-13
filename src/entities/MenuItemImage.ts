import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from "typeorm";
  import { MenuItem } from "./MenuItem";
  
  @Entity("menu_item_images")
  export class MenuItemImage {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "varchar", length: 255 })
    image_url: string;
  
    @ManyToOne(() => MenuItem, (menuItem) => menuItem.images, {
      onDelete: "CASCADE",
    })
    menuItem: MenuItem;
  
    @CreateDateColumn()
    created_at: Date;
  }
  