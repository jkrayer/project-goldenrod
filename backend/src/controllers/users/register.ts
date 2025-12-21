import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { AppError, isPrismaError, prisma } from "../../lib/index.js";

/**
 * Registers a new user in the system.
 *
 * This function handles user registration by:
 * 1. Hashing the provided password using bcrypt
 * 2. Creating a new user record in the database with email, hashed password, and optional username
 * 3. Returning a success response or appropriate error
 *
 * @param req - Express request object containing user registration data in the body
 * @param req.body.email - The user's email address (will be converted to lowercase)
 * @param req.body.password - The user's plain text password (will be hashed)
 * @param req.body.userName - Optional username for the user account
 * @param res - Express response object used to send the response
 * @param next - Express next function for error handling middleware
 *
 * @returns A Promise that resolves to a JSON response with status 201 on success
 *
 * @throws {AppError} 409 - If a user with the provided email already exists
 * @throws {AppError} 500 - If there's an error during password hashing or database operation
 *
 * @example
 * ```typescript
 * // Request body
 * {
 *   email: "user@example.com",
 *   password: "securePassword123",
 *   userName: "johndoe"
 * }
 *
 * // Success response
 * {
 *   data: "User created successfully."
 * }
 * ```
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);

    try {
      await prisma.user.create({
        data: {
          email: req.body.email.toLowerCase(),
          password,
          userName: req.body.userName || "",
        },
      });

      return res.status(201).json({ data: "User created successfully." });
    } catch (prismaError: unknown) {
      if (isPrismaError(prismaError) && prismaError.code === "P2002") {
        return next(new AppError("User already exists.", 409));
      } else {
        return next(new AppError("Internal server error", 500));
      }
    }
  } catch (hashError: unknown) {
    // Additional logging for hashing errors
    console.error("Error hashing password:", hashError);

    return next(new AppError("Internal server error", 500));
  }
};
