import type { NextFunction, Request, Response } from "express";
import { AppError, prisma } from "../../lib/index.js";

/**
 * Retrieves a specific game by ID for the authenticated user.
 *
 * This endpoint validates that the user has access to the requested game by checking
 * the UserGames relationship, then returns the game details if access is granted.
 *
 * @param req - Express request object containing the game ID in params
 * @param req.params.id - The unique identifier of the game to retrieve
 * @param res - Express response object with userId in locals
 * @param res.locals.userId - The authenticated user's ID
 * @param next - Express next function for error handling
 *
 * @returns A JSON response with the game data on success (status 200)
 *
 * @throws {AppError} 400 BadRequest - When the game ID is missing from request parameters
 * @throws {AppError} 403 Forbidden - When the user doesn't have access to the requested game
 * @throws {AppError} 404 NotFound - When the game with the specified ID doesn't exist
 * @throws {AppError} 500 DatabaseError - When database operations fail during user/game relationship lookup or game retrieval
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
    const { userId } = res.locals;

    const userGame = await prisma.userGames.findFirst({
      where: {
        userId: userId,
        gameId: Number(id),
      },
    });

    if (userGame === null) {
      return next(AppError(403, "Forbidden", "Access to this game is denied"));
    }
  } catch (error) {
    return next(
      AppError(
        500,
        "DatabaseError",
        `Can't find user/game relationship ${error instanceof Error ? error.message : String(error)}`,
      ),
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
