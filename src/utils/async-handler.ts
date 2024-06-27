import { Request, Response, NextFunction, RequestHandler } from "express";
import { logger } from "./logger";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;
const asyncHandler =
  (requestHandler: AsyncRequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      next(error);
    });
  };

export { asyncHandler };
