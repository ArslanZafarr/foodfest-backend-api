import { Router } from "express";
import { RestaurantController } from "../../../controller/admin/restaurants/RestaurantController";
import { parsing } from "../../../config/parseMulter";
import path from "path";
import fs from "fs";
import { body } from "express-validator";
const multer = require("multer");
const router = Router();

const RestaurantImageDir = path.join(
  __dirname,
  "../../../../bucket/restaurant"
);
if (!fs.existsSync(RestaurantImageDir)) {
  fs.mkdirSync(RestaurantImageDir, { recursive: true });
  console.log("Restaurant image directory created");
}

const uploader = multer({
  storage: multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
      cb(null, "bucket/restaurant");
    },
    filename: function (req: any, file: any, cb: any) {
      cb(null, file.fieldname + "-" + Date.now() + ".jpg");
    },
  }),
}).single("image");

router.get("/", RestaurantController.index);

router.get("/:id", RestaurantController.show);

router.post(
  "/",
  parsing,
  [
    body("user_id").notEmpty().withMessage("The user_id field is required"),
    body("name").notEmpty().withMessage("The name field is required"),
    body("description")
      .notEmpty()
      .withMessage("The description field is required"),
    body("phone_number")
      .notEmpty()
      .withMessage("The phone_number field is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("address").notEmpty().withMessage("The address field is required"),
    body("restaurant_contact_phone")
      .notEmpty()
      .withMessage("The restaurant_contact_phone field is required"),
    body("owner_fullname")
      .notEmpty()
      .withMessage("The owner_fullname field is required"),
    body("owner_email")
      .notEmpty()
      .withMessage("The owner_email field is required"),
    body("owner_phone")
      .notEmpty()
      .withMessage("The owner_phone field is required"),
  ],
  RestaurantController.create
);

router.put("/:id", uploader, RestaurantController.update);

router.delete("/:id", RestaurantController.delete);

export default router;
