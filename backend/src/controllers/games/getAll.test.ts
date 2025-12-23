import express from "express";
import request from "supertest";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock prisma before importing the controller
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFindMany = jest.fn<any>();

jest.unstable_mockModule("../../lib/prisma.js", () => ({
  prisma: {
    games: {
      findMany: mockFindMany,
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
const { getAll } = await import("./getAll.js");
const { errorHandler } = await import("../../lib/errorHandler.js");
const { authenticateToken } = await import("../../lib/token.js");

// Create a new express application instance
const app = express();
app.use(express.json()); // Add JSON body parser
app.use(authenticateToken); // Add authentication middleware
app.get("/api/games/", getAll);
app.use(errorHandler); // Add error handler middleware

describe("GET /api/games/", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return all game rooms with 200 status", async () => {
    //@ts-expect-error - Mock JWT verification
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: 1, role: "PLAYER" });
    });

    const mockRooms = [
      {
        id: "1",
        name: "Room 1",
        description: "First Room",
      },
      { id: "2", name: "Room 2", description: "Second Room" },
    ];

    mockFindMany.mockResolvedValue(mockRooms);

    const response = await request(app)
      .get("/api/games/")
      .set("Authorization", "Bearer valid-token")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toEqual({ data: mockRooms });
    expect(mockFindMany).toHaveBeenCalledTimes(1);
  });

  it("should return empty array when no game rooms exist", async () => {
    //@ts-expect-error - Mock JWT verification
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: 1, role: "PLAYER" });
    });

    mockFindMany.mockResolvedValue([]);

    const response = await request(app)
      .get("/api/games/")
      .set("Authorization", "Bearer valid-token")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(mockFindMany).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({ data: [] });
  });

  it("should return 500 status on database error", async () => {
    //@ts-expect-error - Mock JWT verification
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: 1, role: "PLAYER" });
    });

    mockFindMany.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get("/api/games/")
      .set("Authorization", "Bearer valid-token")
      .expect("Content-Type", /json/)
      .expect(500);

    expect(response.body.code).toBe(500);
    expect(response.body.errors[0].message).toContain("Error retrieving rooms");
  });

  it("should return 403 when no token is provided", async () => {
    //@ts-expect-error - Mock JWT verification
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(new Error("jwt must be provided"), null);
    });

    const response = await request(app)
      .get("/api/games/")
      .expect("Content-Type", /json/)
      .expect(403);

    expect(response.body).toEqual({ message: "Invalid or expired token" });
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  it("should return 403 when an invalid token is provided", async () => {
    //@ts-expect-error - Mock JWT verification
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(new Error("invalid token"), null);
    });

    const response = await request(app)
      .get("/api/games/")
      .set("Authorization", "Bearer invalid-token")
      .expect("Content-Type", /json/)
      .expect(403);

    expect(response.body).toEqual({ message: "Invalid or expired token" });
    expect(mockFindMany).not.toHaveBeenCalled();
  });
});
