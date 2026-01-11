import type { NextFunction, Request, Response } from "express";
import { AppError, isPrismaError, prisma } from "../../lib/index.js";

/**
 * Retrieves a session by ID along with its members and the current user's role.
 *
 * This endpoint fetches session details, verifies the requesting user is a member,
 * and returns the session information along with all members and their roles.
 *
 * @param req - Express request object containing the session ID in params
 * @param req.params.id - The ID of the session to retrieve
 * @param res - Express response object
 * @param res.locals.userId - The ID of the authenticated user making the request
 * @param next - Express next function for error handling
 *
 * @returns A JSON response with status 200 containing:
 * - session: Object with session id and name
 * - me: Object with the current user's role in the session
 * - members: Array of member objects with userId, name, and role
 *
 * @throws {AppError} 404 NotFoundError - When the session is not found
 * @throws {AppError} 403 AuthorizationError - When the user is not a member of the session
 * @throws {AppError} 500 DatabaseError - When a Prisma error occurs during database operations
 * @throws {AppError} 500 ServerError - When an unexpected error occurs
 *
 * @link https://stackoverflow.com/questions/77823644/is-there-a-possible-way-i-can-join-two-tables-in-prisma
 */
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sessionId = req.params.id;

  // find session id and name from the sessions table
  // find members from the sessionMembers table by sessionId
  // get member names from the users table by userId
  try {
    const session = await prisma.sessions.findUnique({
      where: { id: Number(sessionId) },
      select: {
        id: true,
        name: true,
      },
    });

    if (!session) {
      return next(AppError(404, "NotFoundError", "Session not found."));
    }

    const meData = await prisma.sessionMembers.findUnique({
      where: {
        sessionId_userId: {
          sessionId: Number(sessionId),
          userId: res.locals.userId,
        },
      },
    });

    if (!meData) {
      return next(
        AppError(
          403,
          "AuthorizationError",
          "You are not a member of this session.",
        ),
      );
    }

    const members = await prisma.sessionMembers.findMany({
      where: { sessionId: Number(sessionId) },
      select: {
        userId: true,
        role: true,
        user: {
          select: { userName: true },
        },
      },
    });

    const response = {
      session: {
        id: session.id,
        name: session.name,
      },
      me: {
        role: meData.role,
      },
      members: members.map((member) => ({
        userId: member.userId,
        name: member.user.userName,
        role: member.role,
      })),
    };

    return res.status(200).json({ data: response });
  } catch (prismaError: unknown) {
    if (isPrismaError(prismaError)) {
      return next(
        AppError(500, "DatabaseError", "Failed to retrieve session data."),
      );
    }
    return next(AppError(500, "ServerError", "An unexpected error occurred."));
  }
};
