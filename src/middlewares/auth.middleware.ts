import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User, UserType } from "../models/user.model";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { logger } from "../utils/logger";

const verifyJWT: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new ApiError({
          statusCode: 401,
          message: "Unauthorized request",
        });
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload;

      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError({
          statusCode: 401,
          message: "Invalid access token",
        });
      }

      req.user = user as UserType;
      next();
    } catch (error: any) {
      logger("[error] verifyJWT", error);
      throw new ApiError({ statusCode: 401, message: error?.message });
    }
  }
);

export { verifyJWT };
