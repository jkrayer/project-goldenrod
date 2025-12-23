import type { NextFunction, Request, Response } from "express";
import { AppError, prisma } from "../../lib/index.js";

/**
 * Retrieves a game room by its ID from the database.
 *
 * @param req - Express request object containing the room ID in params
 * @param req.params.id - The unique identifier of the game room to retrieve
 * @param res - Express response object used to send back the room data or error messages
 * @param next - Express next function for error handling middleware
 *
 * @returns A promise that resolves to the Express response object
 *
 * @throws {AppError} 400 - When the id parameter is missing from the request
 * @throws {AppError} 404 - When no room is found with the specified id
 * @throws {AppError} 500 - When a database error or internal server error occurs
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
    return next(
      AppError(400, "BadRequest", "Missing id in request parameters."),
    );
  }

  try {
    const room = await prisma.games.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!room) {
      return next(AppError(404, "NotFound", "Room not found"));
    }

    return res.status(200).json({ data: room });
  } catch (error) {
    return next(
      AppError(
        500,
        "DatabaseError",
        `Can't find room ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }
};
