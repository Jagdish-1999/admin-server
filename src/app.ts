import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app: Express = express();

// middleware calls
app.use(express.static("./public"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

// routes
import { productRouter } from "./routes/product.route";
import { userRouter } from "./routes/user.route";
import { categoryRouter } from "./routes/category.route";
import { orderRouter } from "./routes/order.route";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/orders", orderRouter);

export { app };
