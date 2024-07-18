import { Document, Schema, model, models } from "mongoose";
import { ProductImagesTypes } from "../types";
import { CategoryDocument } from "./category.model";

export interface ProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: ProductImagesTypes[];
  category?: CategoryDocument;
  properties: [Object] | null;
  isAddedToWishlist?: boolean;
  isAddedToCart?: boolean;
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
    name: {
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
    quantity: {
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
    properties: [
      {
        type: Object,
        required: false,
      },
    ],
    isAddedToWishlist: {
      type: Boolean,
      required: false,
      default: false,
    },
    isAddedToCart: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

export const Products = model<ProductDocument>("Products", productSchema);
