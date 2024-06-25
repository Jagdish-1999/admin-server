import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { User, UserType } from "../models/user.model";
import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";

export const verifyJWT: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      process.env.REFRESH_TOKEN_SECRET!
    ) as UserType;
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    //TODO need to remove this line
    logger("[DecodedToken]", decodedToken);

    if (!user) {
      throw new ApiError({
        statusCode: 401,
        message: "Invalid access token",
      });
    }

    //TODO need to remove this line
    logger("[User]: middleware", decodedToken);

    req.user = user as UserType;
    next();
  } catch (error: any) {
    throw new ApiError({ statusCode: 401, message: error?.message });
  }
};
