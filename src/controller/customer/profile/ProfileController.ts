import { Request, Response } from "express";
import { appDataSource } from "../../../config/db";
import { User } from "../../../entities/User";
import { handleValidationErrors } from "../../../common/errorValidationTransformer";
import { Profile } from "../../../entities/Profile";
const bcrypt = require("bcrypt");

export class ProfileController {
  static async index(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const userRepository = appDataSource.getRepository(User);

      // Fetch user along with profile and role
      const user = await userRepository.findOne({
        where: { user_id: userId },
        select: ["user_id", "username", "email", "phone_number"],
        relations: ["profile", "userHasRole.role"],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Extract role name
      const role = user.userHasRole?.role?.name || "Role not assigned";

      // Exclude userHasRole from the response
      const { userHasRole, ...userWithoutRoleRelation } = user;

      return res.status(200).json({
        success: true,
        user: {
          ...userWithoutRoleRelation,
          role,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error,
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      if (handleValidationErrors(req, res)) return;

      const userId = (req as any).user.id;
      const { username, email, phone_number, first_name, last_name } = req.body;

      const image = (req as any).file?.path.replace(/\\/g, "/");

      const userRepository = appDataSource.getRepository(User);
      const profileRepository = appDataSource.getRepository(Profile);

      // Fetch user and related profile
      const user = await userRepository.findOne({
        where: { user_id: userId },
        relations: ["profile"],
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Update user information
      user.username = username || user.username;
      user.email = email || user.email;
      user.phone_number = phone_number || user.phone_number;

      // Update profile information if it exists
      if (user.profile) {
        user.profile.first_name = first_name || user.profile.first_name;
        user.profile.last_name = last_name || user.profile.last_name;
        user.profile.image = image || user.profile.image;
        await profileRepository.save(user.profile);
      }

      // Save the updated user
      await userRepository.save(user);

      return res
        .status(200)
        .json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error", error });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      if (handleValidationErrors(req, res)) return;

      const { current_password, new_password } = req.body;
      const userId = (req as any).user.userId;
      const userRepository = appDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const validPassword = await bcrypt.compare(
        current_password,
        user.password_hash
      );
      if (!validPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Incorrect old password" });
      }

      user.password_hash = await bcrypt.hash(new_password, 10);
      await userRepository.save(user);

      return res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error", error });
    }
  }
}
