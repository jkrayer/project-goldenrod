import type { Request, Response, NextFunction } from "express";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { getAll } from "./getAll.js";
import { prisma } from "../../lib/index.js";

jest.mock("../../lib/index.js", () => ({
  prisma: {
    games: {
      findMany: jest.fn(),
    },
  },
  AppError: jest.fn((status, type, message) => ({
    status,
    type,
    message,
  })),
}));

describe("getAll", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      locals: { userId: "user-123" },
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
    (prisma.games.findMany as jest.Mock) = jest.fn();
  });

  it("should return all games for authenticated user", async () => {
    const mockGames = [
      { id: "game-1", name: "Game 1" },
      { id: "game-2", name: "Game 2" },
    ];

    (prisma.games.findMany as jest.Mock).mockResolvedValue(mockGames);

    await getAll(mockRequest as Request, mockResponse as Response, mockNext);

    expect(prisma.games.findMany).toHaveBeenCalledWith({
      where: { userGames: { some: { userId: "user-123" } } },
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: mockGames });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return empty array when no games found", async () => {
    (prisma.games.findMany as jest.Mock).mockResolvedValue([]);

    await getAll(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: [] });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next with AppError when database error occurs", async () => {
    const dbError = new Error("Database connection failed");
    (prisma.games.findMany as jest.Mock).mockRejectedValue(dbError);

    await getAll(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      code: 500,
      status: "INTERNAL_SERVER_ERROR",
      timestamp: expect.any(String),
      errors: [
        {
          type: "DatabaseError",
          message: "Error retrieving rooms: Database connection failed",
        },
      ],
    });
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it("should handle non-Error exceptions", async () => {
    // @ts-expect-error Testing non-Error throw
    (prisma.games.findMany as jest.Mock).mockRejectedValue("Unknown error");

    await getAll(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith({
      code: 500,
      status: "INTERNAL_SERVER_ERROR",
      timestamp: expect.any(String),
      errors: [
        {
          type: "DatabaseError",
          message: "Error retrieving rooms: Unknown error",
        },
      ],
    });
  });
});
