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

// Import after mocking
const { create } = await import("./create.js");

// Create a new express application instance
const app = express();
app.use(express.json()); // Add JSON body parser
app.post("/api/games/", create);

describe("POST /api/games/", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return 201 when a game is created", async () => {
    const mockGame = {
      name: "Test Game",
      description: "Test Description",
    };

    mockCreate.mockResolvedValue(mockGame);

    const response = await request(app)
      .post("/api/games/")
      .send(mockGame)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toEqual({ data: mockGame });
    expect(mockCreate).toHaveBeenCalledWith({ data: mockGame });
  });

  it("should return 400 when request body is invalid", async () => {
    const invalidGame = {
      invalidField: "Invalid Data",
    };

    const response = await request(app)
      .post("/api/games/")
      .send(invalidGame)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toEqual({ error: "Missing required fields" });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("should return 500 on database error", async () => {
    const mockGame = {
      name: "Test Game",
      description: "Test Description",
    };

    mockCreate.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/api/games/")
      .send(mockGame)
      .expect("Content-Type", /json/)
      .expect(500);

    expect(response.body).toEqual({ error: "Internal server error" });
    expect(mockCreate).toHaveBeenCalledWith({ data: mockGame });
  });
});
