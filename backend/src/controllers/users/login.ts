import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken, prisma } from "../../lib/index.js";

/**
 * Authenticates a user by validating their email and password credentials.
 *
 * @param req - Express request object containing user credentials in the body
 * @param req.body.email - The user's email address
 * @param req.body.password - The user's plain text password to verify
 * @param res - Express response object used to send the authentication result
 *
 * @returns A JSON response with either:
 * - Success (200): User data (excluding id and password) and JWT token
 * - Unauthorized (401): Error message for invalid credentials or user not found
 *
 * @throws Will catch and handle errors related to database queries or password comparison
 *
 * @example
 * ```typescript
 * // Request body
 * {
 *   "email": "user@example.com",
 *   "password": "userPassword123"
 * }
 *
 * // Success response
 * {
 *   "data": { "email": "user@example.com", "name": "John Doe", ... },
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * ```
 */
export const login = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const { id, password, ...data } = user;

    const match = await bcrypt.compare(req.body.password, password);

    if (!match) {
      console.error("Error, password mismatch:", match);

      return res.status(401).json({
        error: `Error, incorrect password for user with email ${req.body.email}`,
      });
    }

    const token = generateToken({ id, role: user.role });

    return res.status(200).json({ data, token });
  } catch (error) {
    console.error("Error finding user:", error);

    return res
      .status(401)
      .json({ error: `Can't find user with email ${req.body.email}` });
  }
};
