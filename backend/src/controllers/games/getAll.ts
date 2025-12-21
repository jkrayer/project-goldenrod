import type { NextFunction, Request, Response } from "express";
import { AppError, prisma } from "../../lib/index.js";

/**
 * Retrieves all game rooms from the database.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns A promise that resolves to the Express response object containing:
 *   - On success: 200 status with JSON containing array of game rooms in `data` property
 *   - On error: 500 status with JSON containing error message
 *
 * @remarks
 * This function queries the `games` table using Prisma ORM to fetch all game records.
 * Errors are logged to console and a generic error message is returned to the client.
 */
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rooms = await prisma.games.findMany();

    return res.status(200).json({ data: rooms });
  } catch (error) {
    return next(
      new AppError(
        `Error retrieving rooms: ${error instanceof Error ? error.message : String(error)}`,
        500,
      ),
    );
  }
};
