import { Document, Schema, model, models } from "mongoose";
import { ProductImagesTypes } from "../types";
import { CategoryDocument } from "./category.model";

export interface ProductDocument extends Document {
  productName: string;
  description: string;
  price: number;
  qty: number;
  images: ProductImagesTypes[];
  category?: CategoryDocument;
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

const productSchema = new Schema<ProductDocument>(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
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
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export const Products = model<ProductDocument>("Products", productSchema);
