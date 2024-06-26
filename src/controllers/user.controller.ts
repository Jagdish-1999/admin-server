import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { logger } from "../utils/logger";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;

  logger("[type body] ", typeof body);
  logger("[body] ", body);
  logger("[file] ", req.file);
  logger("[files] ", req.files);

  res.json({ message: "Route is working" });
});

export { registerUser };
