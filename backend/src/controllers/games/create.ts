import type { NextFunction, Request, Response } from "express";
import { AppError, prisma } from "../../lib/index.js";

/**
 * Creates a new game room in the database.
 *
 * @param req - Express request object containing the room data in the body
 * @param req.body.name - The name of the game room (required)
 * @param req.body.description - The description of the game room (required)
 * @param res - Express response object
 * @param next - Express next function for error handling middleware
 *
 * @returns A promise that resolves to the Express response object
 *
 * @remarks
 * This function performs the following operations:
 * - Validates that required fields (name and description) are present
 * - Creates a new game room entry in the database using Prisma
 * - Returns appropriate HTTP status codes based on the outcome
 *
 * @throws {AppError} 403 - If user lacks permission (must be ADMIN or DM)
 * @throws {AppError} 500 - If database operation fails
 *
 * @example
 * ```typescript
 * // Request body
 * {
 *   "name": "Adventure Quest",
 *   "description": "An exciting adventure game"
 * }
 *
 * // Success response (201)
 * {
 *   "data": {
 *     "id": 1,
 *     "name": "Adventure Quest",
 *     "description": "An exciting adventure game"
 *   }
 * }
 * ```
 */
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userRole, userId } = res.locals;

  if (["ADMIN", "DM"].includes(userRole) === false) {
    return next(
      AppError(
        403,
        "PermissionDenied",
        "Insufficient permission: Only Admins and DMs can create game rooms",
      ),
    );
  }

  const { name, description } = req.body;

  try {
    const newRoom = await prisma.games.create({
      data: {
        name,
        description,
        userId,
      },
    });

    return res.status(201).json({ data: newRoom });
  } catch (error) {
    return next(
      AppError(
        500,
        "DatabaseError",
        `Error creating room: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }
};
