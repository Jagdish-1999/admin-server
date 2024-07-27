import { model, Schema } from "mongoose";

export interface OrderDocument {
  orderItems: Object;
  name: string;
  email: string;
  contact: number;
  alternateNumber: number;
  city: string;
  postalCode: string;
  streetAddress: string;
  state: string;
  country: string;
  isPaid: boolean;
}

const orderSchema = new Schema(
  {
    orderItems: [Object],
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    alternateNumber: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: Number,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const Orders = model<OrderDocument>("Orders", orderSchema);
