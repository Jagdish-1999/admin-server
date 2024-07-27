import mongoose from "mongoose";
import { OrderDocument, Orders } from "../models/order.model";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { Products } from "../models/product.model";
import { ApiResponse } from "../utils/api-response";

const fetchOrder = asyncHandler(async (_req, res) => {
  const orders = await Orders.find().sort({ updatedAt: -1 });

  res.json(
    new ApiResponse({
      statusCode: 200,
      message: "Order fetched successfully",
      data: orders,
    })
  );
});

const createOrder = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    contact,
    alternateNumber,
    streetAddress,
    city,
    postalCode,
    state,
    country,
    isPaid,
    cartItems,
  }: OrderDocument & { cartItems: { [key: string]: number } } = req.body;

  if (
    !name ||
    !email ||
    !contact ||
    !alternateNumber ||
    !streetAddress ||
    !city ||
    !postalCode ||
    !state ||
    !country
  ) {
    throw new ApiError({
      statusCode: 404,
      message: "All marked fields are required",
    });
  }

  const objectIds = Object.keys(cartItems).map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  if (!objectIds.length) {
    throw new ApiError({
      statusCode: 404,
      message: "Select a  product to purchase",
    });
  }

  const products = await Products.aggregate([
    { $match: { _id: { $in: objectIds } } },
    {
      $addFields: {
        quantity: {
          $map: {
            input: { $objectToArray: cartItems },
            as: "item",
            in: {
              $cond: [
                { $eq: ["$$item.k", { $toString: "$_id" }] },
                "$$item.v",
                null,
              ],
            },
          },
        },
      },
    },
    {
      $addFields: {
        quantity: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$quantity",
                as: "item",
                cond: { $ne: ["$$item", null] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $project: {
        _id: 1,
        quantity: 1,
        price: {
          currency: "INR",
          unitPrice: "$price",
          totalPrice: { $multiply: ["$price", "$quantity"] },
        },
        name: "$name",
      },
    },
  ]);

  const order = await Orders.create({
    name,
    email,
    contact,
    alternateNumber,
    streetAddress,
    city,
    postalCode,
    state,
    country,
    orderItems: products,
    isPaid,
  });

  res.json(
    new ApiResponse({
      statusCode: 200,
      message: "Checkout success",
      data: order,
    })
  );
});
export { fetchOrder, createOrder };
