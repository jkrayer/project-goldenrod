import { type Request, type Response, type NextFunction } from "express";
import { type AnyObject, type Maybe, type ObjectSchema } from "yup";

export const validate =
  <T extends Maybe<AnyObject>>(schema: ObjectSchema<Partial<T>>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Validating request body:", req.body);

      await schema.validate(req.body, { abortEarly: false }); // Validate the request body
      next(); // Proceed to the next middleware or route
    } catch (error) {
      console.error("Validation error:", error);

      res.status(400).json({ errors: error.errors }); // Return validation errors
    }
  };
