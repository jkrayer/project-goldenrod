import type { NextFunction, Request, Response } from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { get } from "./get.js";
import { prisma } from "../../lib/index.js";

jest.mock("../../lib/index.js", () => ({
  AppError: jest.fn().mockImplementation((status, type, message) => ({
    code: status,
    status: "MOCKED_STATUS",
    timestamp: "2024-01-01T00:00:00.000Z",
    errors: [{ type, message }],
  })),
  prisma: {
    userGames: {
      findFirst: jest.fn(),
    },
    games: {
      findUnique: jest.fn(),
    },
  },
}));

describe("get", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {},
    };
    res = {
      locals: { userId: 1 },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    next = jest.fn();
    jest.clearAllMocks();
    (prisma.games.findUnique as jest.Mock) = jest.fn();
    (prisma.userGames.findFirst as jest.Mock) = jest.fn();
  });

  it("should return 400 when id is missing", async () => {
    req.params = {};

    await get(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith({
      code: 400,
      status: "BAD_REQUEST",
      timestamp: expect.any(String),
      errors: [
        {
          type: "BadRequest",
          message: "Missing id in request parameters.",
        },
      ],
    });
  });

  it("should return 403 when user does not have access to the game", async () => {
    req.params = { id: "123" };
    (
      prisma.userGames.findFirst as jest.MockedFunction<
        typeof prisma.userGames.findFirst
      >
    ).mockResolvedValue(null);

    await get(req as Request, res as Response, next);

    expect(prisma.userGames.findFirst).toHaveBeenCalledWith({
      where: { userId: 1, gameId: 123 },
    });

    expect(next).toHaveBeenCalledWith({
      code: 403,
      status: "FORBIDDEN",
      timestamp: expect.any(String),
      errors: [
        {
          type: "Forbidden",
          message: "Access to this game is denied",
        },
      ],
    });
  });

  it("should return 500 when userGames query fails", async () => {
    req.params = { id: "123" };
    const error = new Error("Database connection failed");
    (
      prisma.userGames.findFirst as jest.MockedFunction<
        typeof prisma.userGames.findFirst
      >
    ).mockRejectedValue(error);

    await get(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith({
      code: 500,
      status: "INTERNAL_SERVER_ERROR",
      timestamp: expect.any(String),
      errors: [
        {
          type: "DatabaseError",
          message: `Can't find user/game relationship Database connection failed`,
        },
      ],
    });
  });

  it("should return 404 when game is not found", async () => {
    req.params = { id: "123" };
    (
      prisma.userGames.findFirst as jest.MockedFunction<
        typeof prisma.userGames.findFirst
      >
    )
      // @ts-expect-error dummy data
      .mockResolvedValue({
        userId: 1,
        gameId: 123,
      });

    (
      prisma.games.findUnique as jest.MockedFunction<
        typeof prisma.games.findUnique
      >
    ).mockResolvedValue(null);

    await get(req as Request, res as Response, next);

    expect(prisma.games.findUnique).toHaveBeenCalledWith({
      where: { id: 123 },
    });

    expect(next).toHaveBeenCalledWith({
      code: 404,
      status: "NOT_FOUND",
      timestamp: expect.any(String),
      errors: [
        {
          type: "NotFound",
          message: "Room not found",
        },
      ],
    });
  });

  it("should return 500 when games query fails", async () => {
    req.params = { id: "123" };
    const error = new Error("Database timeout");
    (
      prisma.userGames.findFirst as jest.MockedFunction<
        typeof prisma.userGames.findFirst
      >
    )
      // @ts-expect-error dummy data
      .mockResolvedValue({
        userId: 1,
        gameId: 123,
      });

    (
      prisma.games.findUnique as jest.MockedFunction<
        typeof prisma.games.findUnique
      >
    ).mockRejectedValue(error);

    await get(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith({
      code: 500,
      status: "INTERNAL_SERVER_ERROR",
      timestamp: expect.any(String),
      errors: [
        {
          type: "DatabaseError",
          message: `Can't find room Database timeout`,
        },
      ],
    });
  });

  it("should return 200 with game data when successful", async () => {
    req.params = { id: "123" };
    const mockGame = {
      id: 123,
      name: "Test Game",
      description: "A test game",
      createdAt: new Date(),
      userId: 1,
    };
    (
      prisma.userGames.findFirst as jest.MockedFunction<
        typeof prisma.userGames.findFirst
      >
    )
      // @ts-expect-error dummy data
      .mockResolvedValue({
        userId: 1,
        gameId: 123,
      });

    (
      prisma.games.findUnique as jest.MockedFunction<
        typeof prisma.games.findUnique
      >
    ).mockResolvedValue(mockGame);

    await get(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockGame });
    expect(next).not.toHaveBeenCalled();
  });
});
