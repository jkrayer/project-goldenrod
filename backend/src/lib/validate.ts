import { type Request, type Response, type NextFunction } from "express";
import {
  type AnyObject,
  type Maybe,
  type ObjectSchema,
  type ValidationError,
} from "yup";

/**
 * Creates an Express middleware function that validates the request body against a Yup schema.
 *
 * @template T - The type parameter extending Maybe<AnyObject> for the Yup schema
 * @param {ObjectSchema<object, T, object, "">} schema - The Yup schema to validate the request body against
 * @returns {(req: Request, res: Response, next: NextFunction) => Promise<Response | void>} An async Express middleware function that validates the request body
 *
 * @example
 * ```typescript
 * const userSchema = yup.object({ name: yup.string().required() });
 * app.post('/users', validate(userSchema), (req, res) => { ... });
 * ```
 *
 * @remarks
 * - If validation succeeds, calls `next()` to proceed to the next middleware
 * - If validation fails, logs errors to console and returns a 400 status with error details
 * - Uses `abortEarly: false` to collect all validation errors at once
 */
export const validate =
  <T extends Maybe<AnyObject>>(schema: ObjectSchema<object, T, object, "">) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false }); // Validate the request body
      next();
    } catch (error: unknown) {
      console.error(
        `Validation error at ${req.path}:`,
        (error as ValidationError).errors.join(),
      );

      // Return validation errors
      return res
        .status(400)
        .json({ errors: (error as ValidationError).errors });
    }
  };
