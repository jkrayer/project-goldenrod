import type { NextFunction, Request, Response } from "express";
import { AppError, prisma } from "../../lib/index.js";

/**
 * Retrieves a game room by its ID from the database.
 *
 * @param req - Express request object containing the room ID in params
 * @param req.params.id - The unique identifier of the game room to retrieve
 * @param res - Express response object used to send back the room data or error messages
 *
 * @returns A promise that resolves to the Express response object
 *
 * @throws {400} When the id parameter is missing from the request
 * @throws {404} When no room is found with the specified id
 * @throws {500} When a database error or internal server error occurs
 *
 * @remarks
 * This function performs the following operations:
 * 1. Extracts the room ID from request parameters
 * 2. Validates that the ID is present
 * 3. Queries the database for a game room with the matching ID
 * 4. Returns the room data if found, or an appropriate error response
 *
 * @example
 * ```typescript
 * // GET /games/123
 * // Response: { data: { id: 123, ...otherRoomProperties } }
 * ```
 */
export const get = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // validate room data
  if (!id) {
    console.error("Error, missing id in request parameters.");

    return next(new AppError("Missing id in request parameters.", 400));
  }

  try {
    const room = await prisma.games.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!room) {
      return next(new AppError("Room not found", 404));
    }

    return res.status(200).json({ data: room });
  } catch (error) {
    return next(
      new AppError(
        `Can't find room ${error instanceof Error ? error.message : String(error)}`,
        500,
      ),
    );
  }
};
