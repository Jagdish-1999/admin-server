import express from "express";
import {
  createUpdateCategory,
  deleteCategoryWithIds,
  fetchCategories,
} from "../controllers/category.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(verifyJWT, fetchCategories);
router.route("/create").post(verifyJWT, createUpdateCategory);
router.route("/update").put(verifyJWT, createUpdateCategory);
router.route("/delete").delete(verifyJWT, deleteCategoryWithIds);

export { router as categoryRouter };
