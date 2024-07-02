import { Category, CategoryDocument } from "../models/category.model";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import { logger } from "../utils/logger";

const fetchCategories = asyncHandler(async (_req, res) => {
  const categoryDocs: CategoryDocument[] = await Category.find({ __v: 0 }).sort(
    {
      updatedAt: -1,
    }
  );

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

const createUpdateCategory = asyncHandler(async (req, res) => {
  const { name, id } = req.body;
  if (!name) {
    throw new ApiError({
      statusCode: 400,
      message: "Category name is required",
    });
  }

  let category: CategoryDocument | null = null;

  if (id) {
    logger("id", id);
    try {
      category = await Category.findByIdAndUpdate(
        { _id: id },
        { $set: { name } },
        { new: true, upsert: true } // Create new if it doesn't exist)
      );
    } catch (error) {}
  } else {
    category = await Category.create({ name });
  }
  res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      data: category,
      message: id
        ? "Category updated successfully"
        : "Category created successfully",
    })
  );
});

const deleteCategoryWithIds = asyncHandler(async (req, res) => {
  const categoryIds = req.body;

  const deletedIds = await Promise.all(
    categoryIds.map(async (eachId: string) => {
      try {
        return await Category.findByIdAndDelete(eachId);
      } catch (error) {
        console.log(`${eachId} is not deleted`);
      }
    })
  );

  res.json(
    new ApiResponse({
      statusCode: 200,
      data: deletedIds,
      message:
        categoryIds.length === 1
          ? "Category deleted successfully"
          : "Categories deleted successfully",
    })
  );
});

export { createUpdateCategory, fetchCategories, deleteCategoryWithIds };
