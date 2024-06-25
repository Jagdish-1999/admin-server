import { Products } from "../models/product.model";
import { deleteImagesFromCloudinary } from "./cloudinary-actions";

export const deleteImagesFromCnrAndDb = async (
  availableIdsForDelete: string[]
) => {
  // Remove images from cloudinary
  await deleteImagesFromCloudinary(availableIdsForDelete);
  // Remove images from Database
  await Products.updateMany(
    { "images.id": { $in: availableIdsForDelete } },
    { $pull: { images: { id: { $in: availableIdsForDelete } } } }
  );
};
