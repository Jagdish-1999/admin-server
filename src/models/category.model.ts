import { Document, Schema, model, models } from "mongoose";

export interface CategoryDocument extends Document {
  createdAt: string;
  updatedAt: string;
  name: string;
  _id: string;
}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Category =
  models.Category || model<CategoryDocument>("Category", categorySchema);
