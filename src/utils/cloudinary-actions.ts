import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { logger } from "./logger";

interface CloudinaryDeleteResponse {
  result: string;
}

const deleteImagesOnCloudinary = async (
  publicIds: string[]
): Promise<boolean> => {
  try {
    const results: CloudinaryDeleteResponse[] = await Promise.all(
      publicIds.map((id) => cloudinary.uploader.destroy(id))
    );
    logger("results", results);
    return results.every((result) => result.result === "ok");
  } catch (error) {
    console.error("Error deleting images from Cloudinary:", error);
    logger("error", error);

    return false;
  }
};

export interface RestoreImagesReturn {
  restoredImages: UploadApiResponse[];
  isAllDeleted: boolean;
}
const restoreImagesOnCloudinary = async (
  imageUrls: string[]
): Promise<RestoreImagesReturn> => {
  let isAllDeleted = false;
  try {
    const restoredImages = await Promise.all(
      imageUrls.map((url) => cloudinary.uploader.upload(url))
    );

    if (restoredImages.length !== imageUrls.length) {
      isAllDeleted = false;
      console.error("Error: Not all images were restored successfully");
    } else {
      isAllDeleted = true;
      console.log("All images restored successfully");
    }
    return { restoredImages, isAllDeleted };
  } catch (error) {
    console.error("Error restoring images on Cloudinary:", error);
    return { restoredImages: [], isAllDeleted };
  }
};

export { deleteImagesOnCloudinary, restoreImagesOnCloudinary };
