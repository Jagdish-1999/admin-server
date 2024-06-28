import express from "express";
import { uploadImages } from "../middlewares/multer.middleware";
import {
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(verifyJWT, fetchUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/register").post(uploadImages.single("avatar"), registerUser);

export { router as userRouter };
