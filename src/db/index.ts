import mongoose from "mongoose";
import { ApiError } from "../utils/api-error";

const connectToDB = async () => {
  const URI = process.env.MONGODB_URI;
  if (!URI) {
    throw new ApiError({
      message: "Database connection string does not exist",
      statusCode: 500,
    });
  } else {
    try {
      const connectionInstance = await mongoose.connect(URI);
      console.log(
        `\n[Success]: MongoDB Connection Success !! DB Host: ${connectionInstance.connection.host}`
      );
    } catch (error) {
      console.log(`[Failed]: MongoDB Connection failed: ${error}`);
      process.exit(1);
    }
  }
};

export { connectToDB };
