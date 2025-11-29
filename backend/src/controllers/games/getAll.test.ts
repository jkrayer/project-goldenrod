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

// Import after mocking
const { getAll } = await import("./getAll.js");

// Create a new express application instance
const app = express();
app.get("/api/games/", getAll);

describe("GET /api/games/", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return all game rooms with 200 status", async () => {
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
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toEqual({ data: mockRooms });
    expect(mockFindMany).toHaveBeenCalledTimes(1);
  });

  it("should return empty array when no game rooms exist", async () => {
    mockFindMany.mockResolvedValue([]);

    const response = await request(app)
      .get("/api/games/")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(mockFindMany).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({ data: [] });
  });

  it("should return 500 status on database error", async () => {
    mockFindMany.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get("/api/games/")
      .expect("Content-Type", /json/)
      .expect(500);

    expect(response.body).toEqual({ error: "Internal server error" });
  });
});
