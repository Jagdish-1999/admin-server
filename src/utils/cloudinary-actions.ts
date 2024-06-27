import { v2 as cloudinary } from "cloudinary";

export const checkImageExistsOnCloudinary = async (publicId: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.api.resource(publicId, (error, result) => {
      if (error) {
        if (error.http_code === 404) {
          resolve(false);
        } else {
          reject(error);
        }
      } else {
        resolve(true);
      }
    });
  });
};

export const deleteImagesFromCloudinary = async (publicId: string[]) => {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(publicId, (error, result) => {
      if (error) {
        console.log(
          "[Error]: error in deleteImagesFromCloudinary ",
          error,
          publicId
        );
        return reject(error);
      }
      resolve(result);
    });
  });
};
