import express from "express";
import {
	createUpdateProduct,
	deleteProductWithId,
	fetchProducts,
} from "../controllers/product.controller";
import { uploadImages } from "../middlewares/multer.middleware";

const router = express.Router();

router.route("/").get(fetchProducts); // fetching all products
router.route("/create").post(uploadImages.array("images"), createUpdateProduct); // create product
router.route("/:id").put(uploadImages.array("images"), createUpdateProduct); // updating product
router.route("/:id").delete(deleteProductWithId); // delete product

export { router as productRouter };
