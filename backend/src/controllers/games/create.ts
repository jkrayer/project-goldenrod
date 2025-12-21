import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

/**
 * Creates a new game room in the database.
 *
 * @param req - Express request object containing the room data in the body
 * @param req.body.name - The name of the game room (required)
 * @param req.body.description - The description of the game room (required)
 * @param res - Express response object
 *
 * @returns A promise that resolves to the Express response object
 *
 * @remarks
 * This function performs the following operations:
 * - Validates that required fields (name and description) are present
 * - Creates a new game room entry in the database using Prisma
 * - Returns appropriate HTTP status codes based on the outcome
 *
 * @throws Returns 400 Bad Request if required fields are missing
 * @throws Returns 500 Internal Server Error if database operation fails
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
export const create = async (req: Request, res: Response) => {
  const { userRole } = res.locals;

  if (["ADMIN", "DM"].includes(userRole) === false) {
    return res.status(403).json({
      error:
        "Insufficient permission: Only Admins and DMs can create game rooms",
    });
  }

  const { name, description } = req.body;

  try {
    const newRoom = await prisma.games.create({
      data: {
        name,
        description,
      },
    });

    return res.status(201).json({ data: newRoom });
  } catch (error) {
    console.error("Error creating room:", error);

    return res.status(500).json({ error: "Internal server error" });
  }
};
