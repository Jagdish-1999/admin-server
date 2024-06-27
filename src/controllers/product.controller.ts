import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { ProductDocument, Products } from "../models/product.model";
import { uploadImageToCloudinary } from "../middlewares/cloudinary.middleware";
import { ProductImagesTypes } from "../types";
import { ApiError } from "../utils/api-error";
import { deleteImagesFromCloudinary } from "../utils/cloudinary-actions";

const fetchProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Products.find({ __v: 0 }).sort({ updatedAt: -1 });
  res.json(
    new ApiResponse({
      statusCode: 200,
      message: "Product fetched",
      data: products,
    })
  );
});

const createUpdateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { images, payload } = req.body;
    const body = JSON.parse(payload);
    const imagesInPayload: string[] = JSON.parse(images || "[]");
    const id = req.params.id;
    const files = req.files as Express.Multer.File[];

    const imageFiles = await Promise.all(
      files.map(async (file) => {
        const response = await uploadImageToCloudinary(file.path, "products");
        return { url: response?.url, id: response?.public_id };
      })
    );
    if (imageFiles.length) {
      await Promise.all(
        files.map((file) => fs.promises.unlink(path.resolve(file.path)))
      );
    }
    let product: ProductDocument | null = null;
    let existingImages: ProductImagesTypes[] = [];
    if (id) {
      product = (await Products.findById(id)) as ProductDocument;
      const imagesOnDB = product.images;
      let availableIdsForDelete: string[] = [];
      if (imagesInPayload.length) {
        availableIdsForDelete = imagesOnDB
          .filter((eachImage) => !imagesInPayload.includes(eachImage.id))
          .map((ids) => ids.id);
      } else {
        availableIdsForDelete = imagesOnDB.map((ids) => ids.id);
      }
      // Checking if images available for delete when updating product
      if (availableIdsForDelete.length)
        await deleteImagesFromCloudinary(availableIdsForDelete);
      existingImages = product.images.filter(
        (eachImg) => !availableIdsForDelete.includes(eachImg.id)
      );
    }
    const productData = { ...body, images: [...existingImages, ...imageFiles] };
    if (product) {
      // Check if product exists and update it
      product = await Products.findOneAndUpdate(
        { _id: id },
        { $set: productData },
        { new: true, upsert: true } // Create new if it doesn't exist
      );
    } else {
      // Create a new product
      product = new Products<ProductDocument>({
        ...body,
        images: imageFiles,
      }) as ProductDocument;
      await product.save();
    }

    if (product) {
      res.json(
        new ApiResponse({
          statusCode: 200,
          data: product,
          message: "Product created successfully",
        })
      );
    } else {
      throw new ApiError({
        statusCode: 500,
        message: "Product creation failed",
      });
    }
  }
);

const deleteProductWithId = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const productForDelete = (await Products.findById(id)) as ProductDocument;
    if (productForDelete.images.length) {
      const ids = productForDelete.images.map((imgObj) => imgObj.id);
      await deleteImagesFromCloudinary(ids);
    }
    const response = await Products.deleteOne({ _id: id });
    if (response.acknowledged) {
      res.json(
        new ApiResponse({
          statusCode: 200,
          data: [],
          message: "Product deleted successfully",
        })
      );
    } else {
      throw new ApiError({
        statusCode: 500,
        message: "Product not deleted!",
      });
    }
  }
);

export { fetchProducts, createUpdateProduct, deleteProductWithId };
