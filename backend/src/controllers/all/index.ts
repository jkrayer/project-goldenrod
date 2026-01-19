import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../lib/index.js";

export const all = async (req: Request, res: Response, next: NextFunction) => {
  return next(
    AppError(
      404,
      "NotFound",
      `Nothing exists at ${req.originalUrl} on this server!`,
    ),
  );
};
