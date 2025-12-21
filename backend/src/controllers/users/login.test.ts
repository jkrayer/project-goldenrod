import express from "express";
import request from "supertest";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock prisma before importing the controller
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFindUnique = jest.fn<any>();

jest.unstable_mockModule("../../lib/prisma.js", () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
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

// Mock generateToken
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGenerateToken = jest.fn<any>();

jest.unstable_mockModule("../../lib/token.js", () => ({
  generateToken: mockGenerateToken,
}));

// Import after mocking
const { login } = await import("./login.js");
const { errorHandler } = await import("../../lib/errorHandler.js");

// Create a new express application instance
const app = express();
app.use(express.json()); // Add JSON body parser
app.post("/api/users/login", login);
app.use(errorHandler); // Add error handler middleware

describe("POST /api/users/login ", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return 200 with token when credentials are valid", async () => {
    const mockUser = {
      id: 1,
      userName: "TestUser",
      email: "testuser@example.com",
      password: "$2b$10$hashedpassword",
      role: "PLAYER",
    };

    mockFindUnique.mockResolvedValue(mockUser);
    mockCompare.mockResolvedValue(true);
    mockGenerateToken.mockReturnValue("mock-jwt-token");

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "testuser@example.com", password: "password123" })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toEqual({
      data: {
        userName: "TestUser",
        email: "testuser@example.com",
        role: "PLAYER",
      },
      token: "mock-jwt-token",
    });
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: "testuser@example.com" },
    });
    expect(mockCompare).toHaveBeenCalledWith(
      "password123",
      "$2b$10$hashedpassword",
    );
    expect(mockGenerateToken).toHaveBeenCalledWith({ id: 1, role: "PLAYER" });
  });

  it("should return 401 when user not found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "nonexistent@example.com", password: "password123" })
      .expect("Content-Type", /json/)
      .expect(401);

    expect(response.body).toEqual({
      error: "User with email nonexistent@example.com not found",
    });
    expect(mockCompare).not.toHaveBeenCalled();
    expect(mockGenerateToken).not.toHaveBeenCalled();
  });

  it("should return 401 when password is incorrect", async () => {
    const mockUser = {
      id: 1,
      userName: "TestUser",
      email: "testuser@example.com",
      password: "$2b$10$hashedpassword",
      role: "PLAYER",
    };

    mockFindUnique.mockResolvedValue(mockUser);
    mockCompare.mockResolvedValue(false);

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "testuser@example.com", password: "wrongpassword" })
      .expect("Content-Type", /json/)
      .expect(401);

    expect(response.body).toEqual({
      error: "Incorrect password for user with email testuser@example.com",
    });
    expect(mockCompare).toHaveBeenCalledWith(
      "wrongpassword",
      "$2b$10$hashedpassword",
    );
    expect(mockGenerateToken).not.toHaveBeenCalled();
  });

  it("should return 400 on database error", async () => {
    mockFindUnique.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "testuser@example.com", password: "password123" })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toEqual({ error: "Login failed Database error" });
    expect(mockGenerateToken).not.toHaveBeenCalled();
  });
});
