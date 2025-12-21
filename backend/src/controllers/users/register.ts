import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";
import { isPrismaError } from "../../lib/isPrismaError.js";

/**
 * Registers a new user by creating a user account with hashed password.
 *
 * @param req - Express request object containing user registration data in the body:
 *   - email: User's email address (will be converted to lowercase)
 *   - password: User's plain text password (will be hashed)
 *   - userName: Optional username (defaults to empty string)
 * @param res - Express response object
 *
 * @returns A JSON response with one of the following:
 *   - 201: User created successfully with success message
 *   - 409: User already exists (duplicate email)
 *   - 500: Internal server error (password hashing or database error)
 *
 * @throws Logs errors to console for password hashing failures and Prisma database errors
 */
export const register = async (req: Request, res: Response) => {
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
      console.error("Error creating user:", prismaError);

      if (isPrismaError(prismaError) && prismaError.code === "P2002") {
        return res.status(409).json({ error: "User already exists." });
      } else {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  } catch (hashError: unknown) {
    console.error("Error hashing password:", hashError);

    return res.status(500).json({ error: "Internal server error" });
  }
};
