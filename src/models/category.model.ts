import { Document, Schema, model, models } from "mongoose";

export interface CategoryDocument extends Document {
  createdAt: string;
  updatedAt: string;
  name: string;
  parent: CategoryDocument;
  _id: string;
}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    parent: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

export const Category = model<CategoryDocument>("Category", categorySchema);
