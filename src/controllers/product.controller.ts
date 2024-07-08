import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import { ProductDocument, Products } from "../models/product.model";
import { uploadImageToCloudinary } from "../middlewares/cloudinary.middleware";
import { ProductImagesTypes } from "../types";
import { ApiError } from "../utils/api-error";
import {
  RestoreImagesReturn,
  deleteImagesOnCloudinary,
  restoreImagesOnCloudinary,
} from "../utils/cloudinary-actions";
import { logger } from "../utils/logger";

export interface ProductPropertiesTypes {
  name: string;
  value: string;
}

export interface CreateUpdateProductTypes {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  properties: ProductPropertiesTypes[];
  images: ProductImagesTypes[];
}

const fetchProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Products.find()
    .populate("category")
    .sort({ updatedAt: -1 });

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
    const body: CreateUpdateProductTypes = JSON.parse(payload);
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
        await deleteImagesOnCloudinary(availableIdsForDelete);
      existingImages = product.images.filter(
        (eachImg) => !availableIdsForDelete.includes(eachImg.id)
      );
    }
    const productData = { ...body, images: [...existingImages, ...imageFiles] };
    const properties = productData.properties.filter(
      (property) => property.value
    );
    if (product) {
      // Check if product exists and update it
      product = await Products.findOneAndUpdate(
        { _id: id },
        { $set: { ...productData, properties } },
        { new: true, upsert: true } // Create new if it doesn't exist
      );
    } else {
      // Create a new product
      // product = new Products<ProductDocument>({
      //   ...body,
      //   images: imageFiles,
      // }) as ProductDocument;
      // await product.save();
      product = await Products.create({
        ...body,
        images: imageFiles,
        properties,
      });
    }

    if (product) {
      const populatedProduct = await Products.findOne({
        _id: product._id,
      }).populate("category");

      res.json(
        new ApiResponse({
          statusCode: 200,
          data: populatedProduct,
          message: id
            ? "Product updated successfully"
            : "Product created successfully",
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

const deleteProductWithIds = asyncHandler(
  async (req: Request, res: Response) => {
    const productIds: string[] = req.body;

    // fetch products from database
    // check if product exists or not
    // if exist then -
    // get image urls from product
    // try to delete image on cloudinary
    // check all image are deleted
    // if not deleted then -
    //restore images on cloudinary
    // if deleted then -
    // try delete product form database
    // check product deleted successfully
    // if not then -
    //restore image on cloudinary
    // send response to user

    //? FETCHING PRODUCT FROM DATABASE

    const deletedProducts = await Promise.all(
      productIds.map(async (pid) => {
        const product: ProductDocument | null = await Products.findById(pid);

        //? CHECKING IF PRODUCT NOT EXIST IN DATABASE

        if (!product) {
          throw new ApiError({ statusCode: 400, message: "Product not found" });
        }

        //? ELSE IF PRODUCT EXIST IN DATABASE

        const imageUrls = product.images.map((image) => image.url);
        const imagePublicIds = product.images.map((image) => image.id);

        //? TRY TO DELETE IMAGE ON CLOUDINARY

        const areImagesDeleted = await deleteImagesOnCloudinary(imagePublicIds);
        logger("areImagesDeleted", areImagesDeleted);

        //? IF IMAGES NOT DELETED ON CLOUDINARY

        let restoredImages: RestoreImagesReturn = {} as RestoreImagesReturn;
        if (!areImagesDeleted) {
          restoredImages = await restoreImagesOnCloudinary(imageUrls);

          if (!restoredImages.isAllDeleted) {
            //* ADD LOGIC WHEN ALL IMAGES ARE NOT RESTORED
          } else
            [
              //* ADD LOGIC WHEN ALL IMAGES ARE RESTORED
            ];
        } else {
          //? ELSE IF IMAGES DELETED ON CLOUDINARY

          const productDeleted = await Products.findByIdAndDelete(pid);

          if (!productDeleted) {
            restoredImages = await restoreImagesOnCloudinary(imageUrls);

            if (!restoredImages.isAllDeleted) {
              //* ADD LOGIC WHEN ALL IMAGES ARE NOT RESTORED
            } else
              [
                //* ADD LOGIC WHEN ALL IMAGES ARE RESTORED
              ];
          }
        }
        return product;
      })
    );

    //? SEND RESPONSE TO USER
    res.json(
      new ApiResponse({
        statusCode: 200,
        data: deletedProducts,
        message: "Product deleted successfully",
      })
    );
  }
);

export { fetchProducts, createUpdateProduct, deleteProductWithIds };
