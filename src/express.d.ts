import { UserType } from "./models/user.model";
import { Request } from "express";

declare module "express" {
  interface Request {
    user?: UserType;
  }
}
