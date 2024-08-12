import { Router } from "express";
import { UserController } from "../../../controller/admin/user/UserController";
import { parsing } from "../../../config/parseMulter";
import path from "path";
import fs from "fs";
import { body } from "express-validator";
const multer = require("multer");
const router = Router();

const UserImageDir = path.join(__dirname, "../../../../bucket/user");
if (!fs.existsSync(UserImageDir)) {
  fs.mkdirSync(UserImageDir, { recursive: true });
  console.log("User image directory created");
}

const uploader = multer({
  storage: multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
      cb(null, "bucket/user");
    },
    filename: function (req: any, file: any, cb: any) {
      cb(null, file.fieldname + "-" + Date.now() + ".jpg");
    },
  }),
}).single("image");

// Get all users
router.get("/", UserController.index);

// Get a single user by ID
router.get("/:id", UserController.show);

// Create a new user
router.post(
  "/",
  parsing,
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
  UserController.create
);

// Update an existing user by ID
router.put("/:id", uploader, UserController.update);

// Delete a user by ID
router.delete("/:id", UserController.delete);

export default router;
