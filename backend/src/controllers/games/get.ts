import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

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
export const get = async (req: Request, res: Response) => {
  const { id } = req.params;

  // validate room data
  if (!id) {
    console.error("Error, missing id in request parameters.");

    return res.status(400).json({ error: "Missing id in request parameters." });
  }

  try {
    const room = await prisma.games.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!room) {
      throw new Error("Room not found");
    }

    return res.status(200).json({ data: room });
  } catch (error) {
    console.error(`Error, can't find room with id ${id}:`, error);

    return res.status(404).json({ error: `Can't find room ${id}` });
  }
};
