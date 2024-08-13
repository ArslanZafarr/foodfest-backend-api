import { Request, Response } from "express";
import { appDataSource } from "../../../config/db";
import { Restaurant } from "../../../entities/Restaurant";
import { User } from "../../../entities/User";
import { RestaurantTiming } from "../../../entities/RestaurantTiming";
import { RestaurantTags } from "../../../entities/RestaurantTags";
import { RestaurantCuisines } from "../../../entities/RestaurantCuisines";
import { Menu } from "../../../entities/Menu";
import { handleValidationErrors } from "../../../common/errorValidationTransformer";

export class RestaurantController {
  static async index(req: Request, res: Response) {
    try {
      const restaurantRepository = appDataSource.getRepository(Restaurant);

      // Retrieve all restaurants with related entities if needed
      const restaurants = await restaurantRepository.find({
        relations: ["timings", "ratings", "tags", "cuisines", "menus"],
        order: { created_at: "DESC" }, // Optional: Order by creation date
      });

      return res.status(200).json({
        success: true,
        message: "All restaurants retrieved successfully",
        restaurants,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const restaurantRepository = appDataSource.getRepository(Restaurant);

      const restaurant = await restaurantRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["timings", "ratings", "tags", "cuisines", "menus"],
      });

      if (!restaurant) {
        return res.status(404).json({
          success: true,
          message: "Restaurant not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Restaurant details retrieved successfully",
        restaurant,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async create(req: Request, res: Response) {
    const {
      user_id,
      name,
      description,
      phone_number,
      email,
      address,
      restaurant_contact_phone,
      owner_fullname,
      owner_email,
      owner_phone,
      latitude,
      longitude,
      timings,
      tags,
      cuisines,
      menus,
    } = req.body;
    if (handleValidationErrors(req, res)) return;

    console.log("restaurant_body" , req.body)

    try {
      // Get repositories
      const restaurantRepository = appDataSource.getRepository(Restaurant);
      const userRepository = appDataSource.getRepository(User);

      // Find user who is registering the restaurant
      const user = await userRepository.findOne({
        where: { user_id: user_id },
      });
      if (!user) {
        return res.status(404).json({
          success: true,
          message: "User not found",
        });
      }

      // Check for existing restaurant with the same phone number
      const existingRestaurant = await restaurantRepository.findOne({
        where: [{ phone_number: phone_number }, { email: email }],
      });

      if (existingRestaurant) {
        return res.status(400).json({
          success: false,
          message:
            "A restaurant with this phone number or email already exists",
        });
      }

      // Create and save the restaurant
      const restaurant = restaurantRepository.create({
        name,
        description,
        phone_number,
        email,
        address,
        restaurant_contact_phone,
        owner_fullname,
        owner_email,
        owner_phone,
        latitude,
        longitude,
        is_verified: false,
      });

      await restaurantRepository.save(restaurant);

      // Save restaurant timings
      if (timings && Array.isArray(timings)) {
        const timingRepository = appDataSource.getRepository(RestaurantTiming);
        const timingEntities = timings.map((timing: any) => {
          if (!timing.day_of_week || !timing.open_time || !timing.close_time) {
            throw new Error("Missing required fields in timings data");
          }
          return timingRepository.create({
            day_of_week: timing.day_of_week,
            open_time: timing.open_time,
            close_time: timing.close_time,
            restaurant,
          });
        });
        await timingRepository.save(timingEntities);
      }

      // Save restaurant tags
      if (tags) {
        const tagRepository = appDataSource.getRepository(RestaurantTags);
        const tagEntities = tags.map((tag: any) => {
          return tagRepository.create({
            tag_name: tag,
            restaurant,
          });
        });
        await tagRepository.save(tagEntities);
      }

      // Save restaurant cuisines
      if (cuisines) {
        const cuisineRepository =
          appDataSource.getRepository(RestaurantCuisines);
        const cuisineEntities = cuisines.map((cuisine: any) => {
          return cuisineRepository.create({
            cuisine_name: cuisine,
            restaurant,
          });
        });
        await cuisineRepository.save(cuisineEntities);
      }

      // Save menus
      if (menus) {
        const menuRepository = appDataSource.getRepository(Menu);
        const menuEntities = menus.map((menu: any) => {
          return menuRepository.create({
            ...menu,
            restaurant,
          });
        });
        await menuRepository.save(menuEntities);
      }

      return res.status(201).json({
        success: true,
        message: "Restaurant registered successfully",
        restaurant,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = req.body;

    try {
      const restaurantRepository = appDataSource.getRepository(Restaurant);
      const restaurant = await restaurantRepository.findOne({
        where: { id: parseInt(id) },
      });

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Update restaurant details
      restaurantRepository.merge(restaurant, updateData);
      await restaurantRepository.save(restaurant);

      return res
        .status(200)
        .json({ message: "Restaurant updated successfully", restaurant });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const restaurantRepository = appDataSource.getRepository(Restaurant);
      const result = await restaurantRepository.delete(id);

      if (result.affected === 0) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      return res
        .status(200)
        .json({ message: "Restaurant deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
