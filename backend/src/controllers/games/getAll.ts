import type { NextFunction, Request, Response } from "express";
import { AppError, prisma } from "../../lib/index.js";

/**
 * Retrieves all game rooms from the database.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function for error handling middleware
 * @returns A promise that resolves to the Express response object containing:
 *   - On success: 200 status with JSON containing array of game rooms in `data` property
 *
 * @throws {AppError} 500 - When a database error occurs
 *
 * @remarks
 * This function queries the `games` table using Prisma ORM to fetch all game
 * records accessible to the current authenticated user.
 */
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = res.locals;

  try {
    const rooms = await prisma.games.findMany({
      where: { userGames: { some: { userId } } },
    });

    return res.status(200).json({ data: rooms });
  } catch (error) {
    return next(
      AppError(
        500,
        "DatabaseError",
        `Error retrieving rooms: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }
};
