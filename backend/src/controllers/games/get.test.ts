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

// Import after mocking
const { get } = await import("./get.js");

// Create a new express application instance
const app = express();
app.get("/api/games/:id", get);

describe("GET /api/games/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return 200 and game data when found", async () => {
    const mockGame = {
      id: 1,
      name: "Test Game",
      description: "Test Description",
    };

    mockFindUnique.mockResolvedValue(mockGame);

    const response = await request(app)
      .get("/api/games/1")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toEqual({ data: mockGame });
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("should return 404 when game not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/games/999")
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toEqual({ error: "Room not found." });
  });

  it("should return 404 when route does not match (no id in URL)", async () => {
    await request(app).get("/api/games/").expect(404); // Express returns 404 for route not found (HTML response)

    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it("should return 500 on database error", async () => {
    mockFindUnique.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get("/api/games/1")
      .expect("Content-Type", /json/)
      .expect(500);

    expect(response.body).toEqual({ error: "Internal server error" });
  });
});
