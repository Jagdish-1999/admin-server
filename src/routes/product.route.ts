import express from "express";
import {
  addToCartWishlist,
  createUpdateProduct,
  deleteProductWithIds,
  fetchCartProducts,
  fetchSelectedProductsWithIds,
  fetchProducts,
  fetchWishlistProducts,
  fetchPDPProduct,
} from "../controllers/product.controller";
import { uploadImages } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(fetchProducts); // fetching all products
router
  .route("/create")
  .post(verifyJWT, uploadImages.array("images"), createUpdateProduct); // create product
router
  .route("/:id")
  .put(verifyJWT, uploadImages.array("images"), createUpdateProduct); // updating product
router.route("/delete").delete(verifyJWT, deleteProductWithIds); // delete products
router.route("/wishlist/:id").patch(addToCartWishlist);
router.route("/cart/:id").patch(addToCartWishlist);
router.route("/wishlist").get(fetchWishlistProducts);
router.route("/cart").get(fetchCartProducts);
router.route("/selected-products").post(fetchSelectedProductsWithIds);
router.route("/:id").get(fetchPDPProduct);

export { router as productRouter };
