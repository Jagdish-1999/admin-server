import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define an upload middleware function
export const uploadImageToCloudinary = async (
  filePath: string,
  folder?: string
) => {
  try {
    if (!filePath) {
      throw new Error("Image not found");
    }
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
      folder: folder ? `ecommerse-admin/${folder}` : "ecommerse-admin", // Optional folder in Cloudinary,
    });
    return result;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return null;
  }
};
