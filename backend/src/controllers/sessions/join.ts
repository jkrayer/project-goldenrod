import type { NextFunction, Request, Response } from "express";
import { AppError, isPrismaError, prisma } from "../../lib/index.js";

export async function join(req: Request, res: Response, next: NextFunction) {
  if (req.params.id === undefined) {
    return next(AppError(400, "BadRequest", "Session ID is required."));
  }

  const sessionId = parseInt(req.params.id, 10);
  const userId = res.locals.userId as number;

  try {
    const sessionMember = await prisma.sessionMembers.create({
      data: {
        sessionId: sessionId,
        userId: userId,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { userName: true },
    });

    return res.status(200).json({
      data: {
        userId: sessionMember.userId,
        name: user?.userName || "",
        role: sessionMember.role,
      },
    });
  } catch (prismaError: unknown) {
    if (isPrismaError(prismaError)) {
      return next(
        AppError(500, "DatabaseError", "Failed to join the session."),
      );
    }
    return next(AppError(500, "ServerError", "An unexpected error occurred."));
  }
}
