import { Category, CategoryDocument } from "../models/category.model";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";

interface RequestBodyProps {
  name: string;
  _id: string | undefined;
  parent: string;
  properties: { name: string; values: string[] }[];
}

const fetchCategories = asyncHandler(async (_req, res) => {
  const categoryDocs: CategoryDocument[] = await Category.find()
    .populate("parent")
    .sort({
      updatedAt: -1,
    });

  res.json(
    new ApiResponse({
      data: categoryDocs,
      statusCode: 200,
      message: "Category fetched successfully",
    })
  );
});

const createUpdateCategory = asyncHandler(async (req, res) => {
  const { name, _id, parent, properties }: RequestBodyProps = req.body;

  if (!name) {
    throw new ApiError({
      statusCode: 400,
      message: "Category name is required",
    });
  }

  let category: CategoryDocument | null = null;

  if (_id) {
    try {
      category = await Category.findByIdAndUpdate(
        { _id },
        {
          $set: {
            name,
            parent: parent === "" ? null : parent,
            properties: properties.map((each) => ({
              name: each.name,
              values: each.values.map((eachValue) => eachValue.trim()),
            })),
          },
        },
        { new: true, upsert: true } // Create new if it doesn't exist)
      );
    } catch (error) {}
  } else {
    category = await Category.create({
      name,
      parent: parent === "" ? null : parent,
      properties: properties.map((each) => ({
        name: each.name,
        values: each.values.map((eachValue) => eachValue.trim()),
      })),
    });
  }

  if (!category) {
    throw new ApiError({
      statusCode: 500,
      message: "category not created or updated",
    });
  }

  const populatedCategory = await Category.findOne({ _id: category._id })
    .select("-__v")
    .populate("parent")
    .sort({ updatedAt: -1 });

  res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      data: populatedCategory,
      message: _id
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
