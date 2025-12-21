import express from "express";
import request from "supertest";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock prisma before importing the controller
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockCreate = jest.fn<any>();

jest.unstable_mockModule("../../lib/prisma.js", () => ({
  prisma: {
    games: {
      create: mockCreate,
    },
  },
}));

// Mock isPrismaError
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockIsPrismaError = jest.fn<any>();

jest.unstable_mockModule("../../lib/isPrismaError.js", () => ({
  isPrismaError: mockIsPrismaError,
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
const { create } = await import("./create.js");
const { errorHandler } = await import("../../lib/errorHandler.js");
const { authenticateToken } = await import("../../lib/token.js");

// Create a new express application instance
const app = express();
app.use(express.json()); // Add JSON body parser
app.use(authenticateToken); // Add authentication middleware
app.post("/api/games/", create);
app.use(errorHandler);

describe("POST /api/games/", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return 201 when a game is created by ADMIN", async () => {
    //@ts-expect-error - Mock JWT verification to return ADMIN role
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: 1, role: "ADMIN" });
    });

    const mockGame = {
      id: 1,
      name: "Test Game",
      description: "Test Description",
    };

    mockCreate.mockResolvedValue(mockGame);

    const response = await request(app)
      .post("/api/games/")
      .set("Authorization", "Bearer valid-admin-token")
      .send({ name: "Test Game", description: "Test Description" })
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toEqual({ data: mockGame });
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        name: "Test Game",
        description: "Test Description",
      },
    });
  });

  it("should return 201 when a game is created by DM", async () => {
    //@ts-expect-error - Mock JWT verification to return ADMIN role
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: 2, role: "DM" });
    });

    const mockGame = {
      id: 1,
      name: "Test Game",
      description: "Test Description",
    };

    mockCreate.mockResolvedValue(mockGame);

    const response = await request(app)
      .post("/api/games/")
      .set("Authorization", "Bearer valid-dm-token")
      .send({ name: "Test Game", description: "Test Description" })
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toEqual({ data: mockGame });
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        name: "Test Game",
        description: "Test Description",
      },
    });
  });

  it("should return 403 when a PLAYER tries to create a game", async () => {
    //@ts-expect-error - Mock JWT verification to return ADMIN role
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: 3, role: "PLAYER" });
    });

    const response = await request(app)
      .post("/api/games/")
      .set("Authorization", "Bearer valid-player-token")
      .send({ name: "Test Game", description: "Test Description" })
      .expect("Content-Type", /json/)
      .expect(403);

    expect(response.body).toEqual({
      error:
        "Insufficient permission: Only Admins and DMs can create game rooms",
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("should return 403 when no token is provided", async () => {
    //@ts-expect-error - Mock JWT verification to return ADMIN role
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(new Error("jwt must be provided"), null);
    });

    const response = await request(app)
      .post("/api/games/")
      .send({ name: "Test Game", description: "Test Description" })
      .expect("Content-Type", /json/)
      .expect(403);

    expect(response.body).toEqual({ message: "Invalid or expired token" });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("should return 403 when an invalid token is provided", async () => {
    //@ts-expect-error - Mock JWT verification to return ADMIN role
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(new Error("invalid token"), null);
    });

    const response = await request(app)
      .post("/api/games/")
      .set("Authorization", "Bearer invalid-token")
      .send({ name: "Test Game", description: "Test Description" })
      .expect("Content-Type", /json/)
      .expect(403);

    expect(response.body).toEqual({ message: "Invalid or expired token" });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("should return 500 when ADMIN sends invalid data that causes Prisma error", async () => {
    //@ts-expect-error - Mock JWT verification to return ADMIN role
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: 1, role: "ADMIN" });
    });

    // Mock Prisma throwing an error for invalid data (e.g., missing required field)
    mockCreate.mockRejectedValue(
      new Error("Unknown arg `invalidField` in data.invalidField"),
    );

    const response = await request(app)
      .post("/api/games/")
      .set("Authorization", "Bearer valid-admin-token")
      .send({ invalidField: "Invalid Data" })
      .expect("Content-Type", /json/)
      .expect(500);

    expect(response.body.error).toContain("Error creating room");
    expect(mockCreate).toHaveBeenCalled();
  });

  it("should return 500 when DM sends missing required fields", async () => {
    //@ts-expect-error - Mock JWT verification to return DM role
    mockVerify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: 2, role: "DM" });
    });

    // Mock Prisma throwing an error for missing required fields
    mockCreate.mockRejectedValue(new Error("Argument `name` must not be null"));

    const response = await request(app)
      .post("/api/games/")
      .set("Authorization", "Bearer valid-dm-token")
      .send({ description: "Test Description" }) // Missing name
      .expect("Content-Type", /json/)
      .expect(500);

    expect(response.body.error).toContain("Error creating room");
    expect(mockCreate).toHaveBeenCalled();
  });
});
