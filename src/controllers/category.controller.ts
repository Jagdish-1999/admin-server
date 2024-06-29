import { Category, CategoryType } from "../models/category.model";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

const fetchCategories = asyncHandler(async (req, res) => {
  const categoryDocs: CategoryType[] = await Category.find();

  const data = categoryDocs.map((c) => ({
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    name: c.name,
    id: c._id,
  }));

  res.json(
    new ApiResponse({
      data,
      statusCode: 200,
      message: "Category fetched successfully",
    })
  );
});

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new ApiError({
      statusCode: 400,
      message: "Category name is required",
    });
  }

  const categoryDoc = await Category.create({ name });

  res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      data: categoryDoc,
      message: "Category created successfully",
    })
  );
});

export { createCategory, fetchCategories };
