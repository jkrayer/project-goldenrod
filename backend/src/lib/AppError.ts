/**
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
 */
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
