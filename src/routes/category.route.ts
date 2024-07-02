import express from "express";
import {
  createUpdateCategory,
  deleteCategoryWithIds,
  fetchCategories,
} from "../controllers/category.controller";

const router = express.Router();

router.route("/").get(fetchCategories);
router.route("/create").post(createUpdateCategory);
router.route("/update").put(createUpdateCategory);
router.route("/delete").delete(deleteCategoryWithIds);

export { router as categoryRouter };
