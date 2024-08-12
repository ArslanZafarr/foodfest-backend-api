import { Request, Response } from "express";
import { appDataSource } from "../../../config/db";
import { User } from "../../../entities/User";
import { Profile } from "../../../entities/Profile";
import { UserHasRole } from "../../../entities/UserHasRole";
import { Role } from "../../../entities/Role";
import { handleValidationErrors } from "../../../common/errorValidationTransformer";
const bcrypt = require("bcrypt");
const path = require("path");

const baseurl = process.cwd();

export class UserController {
  static async index(req: Request, res: Response) {
    try {
      const userRepository = appDataSource.getRepository(User);

      const users = await userRepository.find({
        relations: ["profile", "userHasRole.role"],
      });

      // Map over the users to remove unwanted fields
      const sanitizedUsers = users.map((user) => {
        const { password_hash, refresh_token, userHasRole, ...rest } = user;
        return {
          ...rest,
          role: userHasRole?.role.name,
          profile: {
            id: user.profile.id,
            first_name: user.profile.first_name,
            last_name: user.profile.last_name,
            image: user.profile.image,
            created_at: user.profile.created_at,
            updated_at: user.profile.updated_at,
          },
        };
      });

      return res.status(200).json({ success: true, users: sanitizedUsers });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error", error });
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const userRepository = appDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: { user_id: userId },
        relations: ["profile", "userHasRole.role"],
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Destructure to remove unwanted fields
      const { password_hash, refresh_token, userHasRole, ...sanitizedUser } =
        user;

      return res.status(200).json({ success: true, user: sanitizedUser });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error", error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      if (handleValidationErrors(req, res)) return;

      const { username, email, password, phone_number } = req.body;

      const userRepository = appDataSource.getRepository(User);
      const roleRepository = appDataSource.getRepository(Role);

      // Check if the username or email already exists
      const existingUser = await userRepository.findOne({
        where: [{ email }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Hash the password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Create a new user instance
      const user = new User();
      user.username = username;
      user.email = email;
      user.password_hash = password_hash;
      user.phone_number = phone_number;

      // Create a new profile instance and associate it with the user
      const profile = new Profile();
      user.profile = profile;

      // Find the "user" role from the database
      const roleName = "user"; // Default role
      const userRole = await roleRepository.findOne({
        where: { name: roleName },
      });

      if (!userRole) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid role" });
      }

      // Create a new UserHasRole instance and associate it with the user and role
      const userHasRole = new UserHasRole();
      userHasRole.user = user;
      userHasRole.role = userRole;
      user.userHasRole = userHasRole;

      // Save the user, which will cascade and save profile and userHasRole due to the relationships
      await userRepository.save(user);

      // Sanitize the user object to remove circular references and sensitive data
      const { password_hash: _, userHasRole: __, ...sanitizedUser } = user;

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: sanitizedUser,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const { username, email, phone_number, first_name, last_name } = req.body;

      const image = (req as any).file?.path.replace(/\\/g, "/");

      const userRepository = appDataSource.getRepository(User);
      const profileRepository = appDataSource.getRepository(Profile);

      const user = await userRepository.findOne({
        where: { user_id: userId },
        relations: ["profile", "userHasRole"],
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      user.username = username || user.username;
      user.email = email || user.email;
      user.phone_number = phone_number || user.phone_number;

      if (user.profile) {
        user.profile.first_name = first_name || user.profile.first_name;
        user.profile.last_name = last_name || user.profile.last_name;
        user.profile.image = image || user.profile.image;
        await profileRepository.save(user.profile);
      }

      await userRepository.save(user);

      // Sanitize the user object to exclude sensitive fields and add the base URL to the image
      const { password_hash, refresh_token, ...sanitizedUser } = user;
      if (sanitizedUser.profile) {
        sanitizedUser.profile.image = sanitizedUser?.profile.image
          ? `${baseurl}/${sanitizedUser.profile.image}`
          : "";
      }

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: sanitizedUser,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const userRepository = appDataSource.getRepository(User);

      const user = await userRepository.findOne({ where: { user_id: userId } });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      await userRepository.remove(user);

      return res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error", error });
    }
  }
}
