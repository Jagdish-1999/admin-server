import express from "express";
import { createOrder, fetchOrder } from "../controllers/order.controller";

const router = express.Router();

router.route("/").get(fetchOrder);
router.route("/create").post(createOrder);

export { router as orderRouter };
