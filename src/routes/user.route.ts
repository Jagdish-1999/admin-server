import express from "express";
import { uploadImages } from "../middlewares/multer.middleware";
import { registerUser } from "../controllers/user.controller";

const router = express.Router();

router.route("/register").post(uploadImages.single("avatar"), registerUser);

export { router as userRouter };
