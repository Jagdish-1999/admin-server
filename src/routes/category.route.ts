import express from "express";
import {
  createUpdateCategory,
  fetchCategories,
} from "../controllers/category.controller";

const router = express.Router();

router.route("/").get(fetchCategories);
router.route("/create").post(createUpdateCategory);
router.route("/update").post(createUpdateCategory);

export { router as categoryRouter };
