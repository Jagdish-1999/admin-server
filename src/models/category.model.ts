import { Document, ObjectId, Schema, model, models } from "mongoose";

interface PropertiesType {
  [key: string]: string[];
}
export interface CategoryDocument extends Document {
  createdAt: string;
  updatedAt: string;
  name: string;
  parent?: ObjectId | null;
  properties?: null;
  _id: string;
}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
      default: null,
      set: (value: any) =>
        typeof value === "string" && value.trim() === "" ? null : value,
    },
    properties: {
      type: Object,
      required: false,
    },
  },
  { timestamps: true }
);

export const Category = model<CategoryDocument>("Category", categorySchema);
