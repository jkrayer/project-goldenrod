import type { NextFunction, Request, Response } from "express";
import {
  type AnyObject,
  type Maybe,
  type ObjectSchema,
  type ValidationError,
} from "yup";
import { FieldErrors } from "./AppError.js";

/**
 * Creates an Express middleware function that validates the request body against a Yup schema.
 *
 * @template T - The type extending Maybe<AnyObject> for the Yup schema
 * @param {ObjectSchema<object, T, object, "">} schema - The Yup object schema to validate against
 * @returns {Function} An async Express middleware function that validates req.body
 *
 * @example
 * ```typescript
 * const userSchema = yup.object({ name: yup.string().required() });
 * app.post('/users', validate(userSchema), (req, res) => { ... });
 * ```
 *
 * @throws {AppError} Throws an AppError with status 400 if validation fails, containing all validation error messages
 */
export const validate =
  <T extends Maybe<AnyObject>>(schema: ObjectSchema<object, T, object, "">) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false }); // Validate the request body
      next();
    } catch (error: unknown) {
      console.log("V", error);

      return next(
        FieldErrors(
          400,
          (error as ValidationError).errors.map((message) => ({
            message,
            field: message.split(" ")[0] || "unknown",
          })),
        ),
      );
    }
  };
