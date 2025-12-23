/**
 * import type { Request, Response, NextFunction } from "express";
 * import { AppError } from "./AppError.js";
 *
 * Thinking this original solution is not correct and testing a new approach below.
 * But I might want stack traces in the future to keeping all of this for now.
 *
 * Express error handling middleware that processes application errors and sends appropriate HTTP responses.
 *
 * @param err - The error object, expected to be an instance of AppError with statusCode and status properties
 * @param req - The Express request object
 * @param res - The Express response object used to send the error response
 * @param next - The Express next function for passing control to the next middleware
 *
 * @returns A JSON response containing the error message with the appropriate HTTP status code
 *
 * @remarks
 * - Defaults to HTTP 500 (Internal Server Error) if no status code is provided
 * - Logs the error to the console for debugging purposes
 * - Returns a JSON object with an `error` property containing the error message
 *
 * export const errorHandler = (
 *   err: AppError,
 *   req: Request,
 *   res: Response,
 *   // next is required for Express error handling middleware signature
 *   // eslint-disable-next-line @typescript-eslint/no-unused-vars
 *   next: NextFunction,
 * ) => {
 *   // Default to 500 if no status code is provided
 *   err.statusCode = err.statusCode || 500;
 *   err.status = err.status || "error";
 *
 *   // Log the error for debugging
 *   console.error("ERROR:", err);
 *
 *   // Send the error response
 *   return res.status(err.statusCode).json({ error: err.message });
 * };
 */

import type { Request, Response, NextFunction } from "express";
import type { ErrorResponse } from "@project_goldenrod/shared";

export const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  // next is required for Express error handling middleware signature
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  // Log the error for debugging
  console.error("ERROR:", JSON.stringify(err, null, 2));

  // Send the error response
  return res.status(err.code).json(err);
};
