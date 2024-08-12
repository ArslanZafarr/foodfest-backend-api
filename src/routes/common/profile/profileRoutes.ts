import express from "express";
import { ProfileController } from "../../../controller/common/ProfileController";
import { parsing } from "../../../config/parseMulter";
import { body } from "express-validator";
import path from "path";
import fs from "fs";
const multer = require("multer");

const router = express.Router();

const UserImageDir = path.join(__dirname, "../../../../bucket/user");
if (!fs.existsSync(UserImageDir)) {
  fs.mkdirSync(UserImageDir, { recursive: true });
  console.log("User image directory created");
}

// Category Routes
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

router.get("/", ProfileController.index);
router.put("/", uploader, ProfileController.update);
router.post(
  "/change-password",
  parsing,
  [
    body("current_password")
      .notEmpty()
      .isString()
      .withMessage("The current_password field is required"),
    body("new_password")
      .notEmpty()
      .isString()
      .withMessage("The new password field is required"),
  ],
  ProfileController.changePassword
);

export default router;
