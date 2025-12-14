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

// Mock bcrypt
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockCompare = jest.fn<any>();

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    compare: mockCompare,
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

  it("should return 200 when credentials are valid", async () => {
    const mockUser = {
      username: "TestUser",
      email: "testuser@example.com",
      password: "$2b$10$hashedpassword",
    };

    mockFindFirst.mockResolvedValue(mockUser);
    mockCompare.mockResolvedValue(true);

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "testuser@example.com", password: "password123" })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toEqual({
      data: {
        username: "TestUser",
        email: "testuser@example.com",
      },
    });
    expect(mockFindFirst).toHaveBeenCalledWith({
      omit: { id: true },
      where: { email: "testuser@example.com" },
    });
    expect(mockCompare).toHaveBeenCalledWith(
      "password123",
      "$2b$10$hashedpassword",
    );
  });

  it("should return 401 when user not found", async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "nonexistent@example.com", password: "password123" })
      .expect("Content-Type", /json/)
      .expect(401);

    expect(response.body).toEqual({ error: "Invalid username or email" });
    expect(mockCompare).not.toHaveBeenCalled();
  });

  it("should return 401 when password is incorrect", async () => {
    const mockUser = {
      username: "TestUser",
      email: "testuser@example.com",
      password: "$2b$10$hashedpassword",
    };

    mockFindFirst.mockResolvedValue(mockUser);
    mockCompare.mockResolvedValue(false);

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "testuser@example.com", password: "wrongpassword" })
      .expect("Content-Type", /json/)
      .expect(401);

    expect(response.body).toEqual({ error: "Invalid username or email" });
    expect(mockCompare).toHaveBeenCalledWith(
      "wrongpassword",
      "$2b$10$hashedpassword",
    );
  });

  it("should return 500 on database error", async () => {
    mockFindFirst.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "testuser@example.com", password: "password123" })
      .expect("Content-Type", /json/)
      .expect(500);

    expect(response.body).toEqual({ error: "Internal server error" });
  });
});
