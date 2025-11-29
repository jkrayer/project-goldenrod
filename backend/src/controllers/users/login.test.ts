import express from "express";
import request from "supertest";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock prisma before importing the controller
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFindFirst = jest.fn<any>();

jest.unstable_mockModule("../../lib/prisma.js", () => ({
  prisma: {
    user: {
      findFirst: mockFindFirst,
    },
  },
}));

// Import after mocking
const { login } = await import("./login.js");

// Create a new express application instance
const app = express();
app.use(express.json()); // Add JSON body parser
app.post("/api/users/login", login);

describe("POST /api/users/login ", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return 200 when the user is found", async () => {
    const mockUser = {
      id: 1,
      username: "TestUser",
      email: "testuser@example.com",
    };

    mockFindFirst.mockResolvedValue(mockUser);

    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "TestUser", email: "testuser@example.com" })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toEqual({ data: mockUser });
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { userName: "TestUser", email: "testuser@example.com" },
    });
  });

  it("should return 401 when user not found", async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "NonExistentUser", email: "nonexistent@example.com" })
      .expect("Content-Type", /json/)
      .expect(401);

    expect(response.body).toEqual({ error: "Invalid username or email" });
  });

  it("should return 500 on database error", async () => {
    mockFindFirst.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "TestUser", email: "testuser@example.com" })
      .expect("Content-Type", /json/)
      .expect(500);

    expect(response.body).toEqual({ error: "Internal server error" });
  });
});
