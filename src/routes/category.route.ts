import express from "express";
import {
  createCategory,
  fetchCategories,
} from "../controllers/category.controller";

const router = express.Router();

router.route("/").get(fetchCategories);
router.route("/create").post(createCategory);

export { router as categoryRouter };
