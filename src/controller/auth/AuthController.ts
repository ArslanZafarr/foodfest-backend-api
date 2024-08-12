import { Request, Response } from "express";
import { appDataSource } from "../../config/db";
const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";
import { User } from "../../entities/User";
import { Role } from "../../entities/Role";
import { UserHasRole } from "../../entities/UserHasRole";
import { Profile } from "../../entities/Profile";
import { handleValidationErrors } from "../../common/errorValidationTransformer";
import { ExpiredToken } from "../../entities/ExpiredToken";
import { sendResetPasswordEmail } from "../../utils/sendEmail";
import {
  JWT_EXPIRATION,
  JWT_SECRET,
  REFRESH_TOKEN_EXPIRATION,
} from "../../config/jwt";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      if (handleValidationErrors(req, res)) return;

      const { username, email, password, phone_number, role } = req.body;
      const userRepository = appDataSource.getRepository(User);
      const roleRepository = appDataSource.getRepository(Role);
      const userHasRoleRepository = appDataSource.getRepository(UserHasRole);
      const profileRepository = appDataSource.getRepository(Profile);

      const existingUser = await userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User();
      user.username = username;
      user.email = email;
      user.password_hash = hashedPassword;
      user.phone_number = phone_number;

      // Create and assign a profile to the user
      const profile = new Profile();
      user.profile = profile;

      // Save the user and profile together (cascade operation)
      await userRepository.save(user);

      // Assign the user role (default or provided)
      const roleName = role || "user"; // Default to "user" role
      const userRole = await roleRepository.findOne({
        where: { name: roleName },
      });

      if (!userRole) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid role" });
      }

      const userHasRole = new UserHasRole();
      userHasRole.user = user;
      userHasRole.role = userRole;
      await userHasRoleRepository.save(userHasRole);

      // Generate tokens
      const accessToken = jwt.sign(
        { id: user.user_id, role: userRole.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );

      const refreshToken = jwt.sign(
        { id: user.user_id, role: userRole.name },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRATION }
      );

      user.refresh_token = refreshToken;
      await userRepository.save(user);

      // Return user details without the password
      const userDetails = {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        profile: user.profile,
        role: userRole.name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        access_token: accessToken,
        refresh_token: refreshToken,
        user: userDetails,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error", error });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      if (handleValidationErrors(req, res)) return;

      const { email, password } = req.body;
      const userRepository = appDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { email },
        relations: ["profile", "userHasRole", "userHasRole.role"],
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const accessToken = jwt.sign(
        { id: user.user_id, role: user.userHasRole.role.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );

      const refreshToken = jwt.sign(
        { id: user.user_id, role: user.userHasRole.role.name },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRATION }
      );

      user.refresh_token = refreshToken;
      await userRepository.save(user);

      // Return user details without the password
      const userDetails = {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        profile: user.profile,
        role: user.userHasRole.role.name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      return res.json({
        success: true,
        access_token: accessToken,
        refresh_token: refreshToken,
        user: userDetails,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }

  static async refreshAccessToken(req: Request, res: Response) {
    try {
      if (handleValidationErrors(req, res)) return;

      const { refresh_token } = req.body;
      const userRepository = appDataSource.getRepository(User);
      const decoded: any = jwt.verify(refresh_token, JWT_SECRET);

      const user = await userRepository.findOne({
        where: { user_id: decoded.userId, refresh_token: refresh_token },
        relations: ["profile", "userHasRole", "userHasRole.role"],
      });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      const accessToken = jwt.sign(
        { id: user.user_id, role: user.userHasRole.role.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );
      return res.json({ success: true, accessToken });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      if (handleValidationErrors(req, res)) return;

      const { refresh_token } = req.body;
      const userRepository = appDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: { refresh_token: refresh_token },
      });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid token",
        });
      }

      user.refresh_token = null;
      await userRepository.save(user);

      // Optionally, store the expired token to prevent reuse
      const expiredToken = new ExpiredToken();
      expiredToken.token = refresh_token;
      await appDataSource.getRepository(ExpiredToken).save(expiredToken);

      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      if (handleValidationErrors(req, res)) return;

      const { email } = req.body;
      const userRepository = appDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const resetToken = jwt.sign({ userId: user.user_id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      // Send email with resetToken
      await sendResetPasswordEmail(user.email, resetToken);

      return res.status(200).json({
        success: true,
        message: "Reset password email sent",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      if (handleValidationErrors(req, res)) return;

      const { token, new_password } = req.body;
      const decoded: any = jwt.verify(token, JWT_SECRET);

      const userRepository = appDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { user_id: decoded.userId },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      user.password_hash = await bcrypt.hash(new_password, 10);
      await userRepository.save(user);

      return res.status(200).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }
}
