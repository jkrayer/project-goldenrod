import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { AppError, generateToken, prisma } from "../../lib/index.js";

/**
 * Handles user login authentication.
 *
 * @param req - Express request object containing user credentials (email and password) in the body
 * @param res - Express response object used to send back the user data and authentication token
 * @param next - Express next function for error handling middleware
 *
 * @returns A promise that resolves to a JSON response containing:
 * - `data`: User information (excluding id and password)
 * - `token`: JWT authentication token
 *
 * @throws {AppError} 401 - When user with provided email is not found
 * @throws {AppError} 401 - When provided password doesn't match stored password
 * @throws {AppError} 400 - When login process fails due to other errors
 *
 * @example
 * ```typescript
 * // Request body should contain:
 * {
 *   "email": "user@example.com",
 *   "password": "userPassword123"
 * }
 * ```
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return next(
        AppError(
          401,
          "UserNotFound",
          `User with email ${req.body.email} not found`,
        ),
      );
    }

    const { id, password, ...data } = user;

    const match = await bcrypt.compare(req.body.password, password);

    if (!match) {
      return next(
        AppError(
          401,
          "InvalidCredentials",
          `Incorrect password for user with email ${req.body.email}`,
        ),
      );
    }

    const token = generateToken({ id, role: user.role });

    return res.status(200).json({ data: { ...data, token } });
  } catch (error: unknown) {
    return next(
      AppError(
        400,
        "LoginFailed",
        `Login failed ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }
};
