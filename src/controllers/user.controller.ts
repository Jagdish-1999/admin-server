import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler";
import { AvatarType, User, UserType } from "../models/user.model";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { uploadImageToCloudinary } from "../middlewares/cloudinary.middleware";
import { unlinkFile } from "../utils/unlinkFile";

// these option are allowing that cookie is modifiable only on server not on user machine
export const cookiesOptions = {
  httpOnly: true,
  secure: true,
};

const fetchUser = asyncHandler(
  async (req: Request & { user?: UserType }, res: Response) => {
    try {
      res.json(
        new ApiResponse({
          statusCode: 200,
          data: req?.user,
          message: "User fetched successfully",
        })
      );
    } catch (error) {
      throw new ApiError({ statusCode: 500, message: "User not fetched" });
    }
  }
);

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field: string) => field.trim() === "")) {
    throw new ApiError({ statusCode: 400, message: "All fields are required" });
  }

  const isUserExist = await User.findOne({ email });
  const avatarLocalPath = req.file?.path;

  if (isUserExist) {
    unlinkFile(avatarLocalPath);
    throw new ApiError({
      message: `Account already exist with this email <${email}>!`,
      statusCode: 409,
    });
  }

  let avatar = {} as AvatarType;

  if (avatarLocalPath) {
    const response = await uploadImageToCloudinary(avatarLocalPath, "users");

    if (response?.url) {
      avatar = { url: response.url, id: response.public_id };
    }
    unlinkFile(avatarLocalPath);
  }

  const userRes = await User.create({ name, email, password, avatar });

  const user = {
    id: userRes._id,
    name: userRes.name,
    email: userRes.email,
    avatar: userRes.avatar,
    createdAt: userRes.createdAt,
    updatedAt: userRes.updatedAt,
  };

  res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: `Account created with this email ${email} successfully`,
      data: user,
    })
  );
});

const generateAccessRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById({ _id: userId });
    if (!user)
      throw new ApiError({ statusCode: 500, message: "No user found in DB" });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError({
      statusCode: 500,
      message: "Error encountered when generating refreshToken and accessToken",
    });
  }
};

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError({
      statusCode: 400,
      message: "Email and password is required",
    });
  }

  const user = await User.findOne({ email }).select("-__v");

  if (!user) {
    throw new ApiError({
      statusCode: 404,
      message: "User not found",
    });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError({ statusCode: 400, message: "Incorrect password" });
  }

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json(
      new ApiResponse({
        statusCode: 200,
        message: "User logged in successfully",
        data: user,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .clearCookie("accessToken", cookiesOptions)
    .clearCookie("refreshToken", cookiesOptions)
    .json(
      new ApiResponse({
        statusCode: 200,
        message: "User logged out successfully",
      })
    );
});

export { registerUser, loginUser, fetchUser, logoutUser };
