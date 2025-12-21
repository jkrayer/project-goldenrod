import express from "express";
import request from "supertest";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock prisma before importing the controller
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFindUnique = jest.fn<any>();

jest.unstable_mockModule("../../lib/prisma.js", () => ({
  prisma: {
    games: {
      findUnique: mockFindUnique,
    },
  },
}));

// Mock JWT verification
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockVerify = jest.fn<any>();

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: mockVerify,
  },
}));

// Import after mocking
const { get } = await import("./get.js");
const { errorHandler } = await import("../../lib/errorHandler.js");
const { authenticateToken } = await import("../../lib/token.js");

// Create a new express application instance
const app = express();
app.use(express.json()); // Add JSON body parser
app.use(authenticateToken); // Add authentication middleware
app.get("/api/games/:id", get);
app.use(errorHandler); // Add error handler middleware

describe("GET /api/games/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return 200 and game data when found", async () => {
    //@ts-expect-error - Mock JWT verification
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: 1, role: "PLAYER" });
    });

    const mockGame = {
      id: 1,
      name: "Test Game",
      description: "Test Description",
    };

    mockFindUnique.mockResolvedValue(mockGame);

    const response = await request(app)
      .get("/api/games/1")
      .set("Authorization", "Bearer valid-token")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toEqual({ data: mockGame });
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("should return 404 when game not found", async () => {
    //@ts-expect-error - Mock JWT verification
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: 1, role: "PLAYER" });
    });

    mockFindUnique.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/games/999")
      .set("Authorization", "Bearer valid-token")
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toEqual({ error: "Room not found" });
  });

  it("should return 500 on database error", async () => {
    //@ts-expect-error - Mock JWT verification
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: 1, role: "PLAYER" });
    });

    mockFindUnique.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get("/api/games/1")
      .set("Authorization", "Bearer valid-token")
      .expect("Content-Type", /json/)
      .expect(500);

    expect(response.body).toEqual({ error: "Can't find room Database error" });
  });

  it("should return 403 when no token is provided", async () => {
    //@ts-expect-error - Mock JWT verification
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(new Error("jwt must be provided"), null);
    });

    const response = await request(app)
      .get("/api/games/1")
      .expect("Content-Type", /json/)
      .expect(403);

    expect(response.body).toEqual({ message: "Invalid or expired token" });
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it("should return 403 when an invalid token is provided", async () => {
    //@ts-expect-error - Mock JWT verification
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(new Error("invalid token"), null);
    });

    const response = await request(app)
      .get("/api/games/1")
      .set("Authorization", "Bearer invalid-token")
      .expect("Content-Type", /json/)
      .expect(403);

    expect(response.body).toEqual({ message: "Invalid or expired token" });
    expect(mockFindUnique).not.toHaveBeenCalled();
  });
});
