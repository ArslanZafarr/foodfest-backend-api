import { Router } from "express";
import { AuthController } from "../../controller/auth/AuthController";
import { body } from "express-validator";

const router = Router();

// Registration route
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("The username field is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("phone_number")
      .notEmpty()
      .withMessage("The phone_number field is required"),
  ],
  AuthController.register
);

// Login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  AuthController.login
);

// Refresh access token route
router.post(
  "/refresh-token",
  [
    body("refresh_token")
      .notEmpty()
      .withMessage("The refresh_token field is required"),
  ],

  AuthController.refreshAccessToken
);

// Logout route
router.post(
  "/logout",
  [
    body("refresh_token")
      .notEmpty()
      .withMessage("The refresh_token field is required"),
  ],

  AuthController.logout
);

// Forgot password route
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Please enter a valid email")],
  AuthController.forgotPassword
);

// Reset password route
router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("The token field is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  AuthController.resetPassword
);

export default router;
