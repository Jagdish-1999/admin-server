import express from "express";
import {
  createUpdateProduct,
  deleteProductWithIds,
  fetchProducts,
} from "../controllers/product.controller";
import { uploadImages } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(verifyJWT, fetchProducts); // fetching all products
router
  .route("/create")
  .post(verifyJWT, uploadImages.array("images"), createUpdateProduct); // create product
router
  .route("/:id")
  .put(verifyJWT, uploadImages.array("images"), createUpdateProduct); // updating product
router.route("/delete").delete(verifyJWT, deleteProductWithIds); // delete products

export { router as productRouter };
