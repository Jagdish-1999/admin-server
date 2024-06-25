// express.d.ts
import * as express from "express";
import { UserType } from "./src/models/user.model";

declare global {
	namespace Express {
		interface Request {
			user?: UserType; // You can replace 'any' with a specific type if you have one
		}
	}
}
