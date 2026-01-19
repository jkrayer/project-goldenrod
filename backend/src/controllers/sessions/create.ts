import type { NextFunction, Request, Response } from "express";
import { AppError, isPrismaError, prisma } from "../../lib/index.js";

/**
 * Creates a new session and adds the creating user as a REFEREE member.
 *
 * This function performs a two-step operation:
 * 1. Creates a new session in the database with the provided name (or "New Session" as default)
 * 2. Adds the creating user as a REFEREE to the newly created session
 *
 * If adding the session member fails, the session creation is rolled back to maintain data consistency.
 *
 * @param req - Express request object. Expected body: `{ name?: string }`
 * @param res - Express response object. Expected locals: `{ userId: string }`
 * @param next - Express next function for error handling
 *
 * @returns A 201 response with the created session ID on success
 *
 * @throws {AppError} 500 DatabaseError - When session creation fails
 * @throws {AppError} 500 DatabaseError - When adding session member fails
 * @throws {AppError} 500 ServerError - When an unexpected error occurs
 */
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Create session
  try {
    const session = await prisma.sessions.create({
      data: {
        createdBy: res.locals.userId,
        name: req.body.name || "New Session",
      },
    });

    // Session created, now add the creating user as a REFEREE
    try {
      await prisma.sessionMembers.create({
        data: {
          sessionId: session.id,
          userId: res.locals.userId,
          role: "REFEREE",
        },
      });
    } catch (prismaError: unknown) {
      // Rollback session creation
      await prisma.sessions.deleteMany({
        where: { id: session.id },
      });

      if (isPrismaError(prismaError)) {
        return next(
          AppError(500, "DatabaseError", "Failed to add session member."),
        );
      }

      return next(
        AppError(500, "ServerError", "An unexpected error occurred."),
      );
    }

    return res.status(201).json({
      data: {
        id: session.id,
      },
    });
  } catch (prismaError: unknown) {
    if (isPrismaError(prismaError)) {
      return next(AppError(500, "DatabaseError", "Failed to create session."));
    }
    return next(AppError(500, "ServerError", "An unexpected error occurred."));
  }
};
