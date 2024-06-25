import { Document, Schema, model, models } from "mongoose";
import { ProductImagesTypes } from "../types";

export interface ProductDocument extends Document {
  productName: string;
  description: string;
  price: number;
  qty: number;
  images: ProductImagesTypes[];
}

const imageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ProductImages =
  models.ProductImages || model("ProductImages", imageSchema);

const productSchema = new Schema<ProductDocument>(
  {
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    images: {
      type: [imageSchema],
      required: false,
    },
  },
  { timestamps: true }
);

export const Products =
  models.Products || model<ProductDocument>("Products", productSchema);
