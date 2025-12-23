import { StatusCodes } from "http-status-codes";
import type { Err, ErrorResponse } from "@project_goldenrod/shared";

/**
 * Thinking this original solution is not correct and testing a new approach below.
 * But I might want stack traces in the future to keeping all of this for now.
 *
 * Custom application error class that extends the native Error class.
 * This class is used to create operational errors with HTTP status codes and additional metadata.
 *
 * @class AppError
 * @extends {Error}
 *
 * @property {number} statusCode - The HTTP status code associated with the error (default: 500)
 * @property {string} status - The status category, either "fail" for 4xx errors or "error" for 5xx errors
 * @property {boolean} isOperational - Flag indicating this is an operational error (always true)
 *
 * @example
 * ```typescript
 * throw new AppError('Resource not found', 404);
 * throw new AppError('Internal server error'); // defaults to 500
 * ```
 *
 * @see {@link https://medium.com/@ravipatel.it/centralized-error-control-in-express-js-a-complete-guide-code-981fbf253379 Centralized Error Control in Express.js}
 *
 * export class AppError extends Error {
 *   code: (typeof StatusCodes)[keyof typeof StatusCodes];
 *   status: keyof typeof StatusCodes;
 *   isOperational: boolean;
 *
 *   constructor(
 *     message: string,
 *     code: (typeof StatusCodes)[keyof typeof StatusCodes] = 500,
 *   ) {
 *     super(message);
 *     this.name = "AppError";
 *     this.code = code;
 *     this.status = StatusCodes[code] as keyof typeof StatusCodes;
 *     this.isOperational = true;
 *     Error.captureStackTrace(this, this.constructor);
 *   }
 * }
 */

//

const ErrorFactory = (
  code: (typeof StatusCodes)[keyof typeof StatusCodes],
  errors: Err | Err[],
): ErrorResponse => ({
  code: code,
  status: StatusCodes[code] as keyof typeof StatusCodes,
  timestamp: new Date().toISOString(),
  errors: Array.isArray(errors) ? errors : [errors],
});

const ErrFactory = (message: string, type: string): Err => ({
  type,
  message,
});

const FieldErrFactory = ({
  message,
  field,
}: {
  message: string;
  field: string;
}): Err => ({
  type: "ValidationError",
  message,
  field,
});

export const AppError = (
  code: (typeof StatusCodes)[keyof typeof StatusCodes],
  type: string,
  message: string,
): ErrorResponse => ErrorFactory(code, ErrFactory(message, type));

export const FieldErrors = (
  code: (typeof StatusCodes)[keyof typeof StatusCodes],
  fieldErrors: { message: string; field: string }[],
): ErrorResponse => ErrorFactory(code, fieldErrors.map(FieldErrFactory));
