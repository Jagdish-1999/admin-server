import mongoose, { Document, Schema, model, models } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { logger } from "../utils/logger";
import { ApiError } from "../utils/api-error";

export interface AvatarType {
  url: string;
  id: string;
}
export interface UserType extends Document {
  name: string;
  email: string;
  avatar: AvatarType;
  password: string;
  createdAt: string;
  updatedAt: string;
  refreshToken: string;
  _id: string;

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const avatarSchema = new Schema(
  {
    url: { type: String },
    id: { type: String },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      lowercase: true,
      trim: true,
      index: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: avatarSchema,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // check in only password field changes
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  if (!password || !this.password) {
    throw new ApiError({
      statusCode: 500,
      message: "Data and hashed argument required!",
    });
  }
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new ApiError({
      statusCode: 500,
      message: "Error comparing password",
    });
  }
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = models.User || model<UserType>("User", userSchema);
