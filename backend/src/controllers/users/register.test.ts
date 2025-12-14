import express from "express";
import request from "supertest";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock prisma before importing the controller
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockCreate = jest.fn<any>();

jest.unstable_mockModule("../../lib/prisma.js", () => ({
  prisma: {
    user: {
      create: mockCreate,
    },
  },
}));

// Mock bcrypt
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockHash = jest.fn<any>();

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: mockHash,
  },
}));

// Mock isPrismaError
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockIsPrismaError = jest.fn<any>();

jest.unstable_mockModule("../../lib/isPrismaError.js", () => ({
  isPrismaError: mockIsPrismaError,
}));

// Import after mocking
const { register } = await import("./register.js");

// Create a new express application instance
const app = express();
app.use(express.json()); // Add JSON body parser
app.post("/api/users/register", register);

describe("POST /api/users/register ", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error during tests
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should return 201 when the user is created", async () => {
    const mockUser = {
      id: 1,
      username: "TestUser",
      email: "testuser@example.com",
      password: "$2b$10$hashedpassword",
    };

    mockHash.mockResolvedValue("$2b$10$hashedpassword");
    mockCreate.mockResolvedValue(mockUser);

    const response = await request(app)
      .post("/api/users/register")
      .send({
        username: "TestUser",
        email: "testuser@example.com",
        password: "password123",
      })
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toEqual({ data: "User created successfully." });
    expect(mockHash).toHaveBeenCalledWith("password123", 10);
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        username: "TestUser",
        email: "testuser@example.com",
        password: "$2b$10$hashedpassword",
      },
    });
  });

  it("should return 409 when the user already exists", async () => {
    const prismaError = {
      code: "P2002",
      message: "Unique constraint failed",
    };

    mockHash.mockResolvedValue("$2b$10$hashedpassword");
    mockCreate.mockRejectedValue(prismaError);
    mockIsPrismaError.mockReturnValue(true);

    const response = await request(app)
      .post("/api/users/register")
      .send({
        username: "TestUser",
        email: "testuser@example.com",
        password: "password123",
      })
      .expect("Content-Type", /json/)
      .expect(409);

    expect(response.body).toEqual({ error: "User already exists." });
    expect(mockIsPrismaError).toHaveBeenCalledWith(prismaError);
  });

  it("should return 500 on database error", async () => {
    const dbError = new Error("Database error");

    mockHash.mockResolvedValue("$2b$10$hashedpassword");
    mockCreate.mockRejectedValue(dbError);
    mockIsPrismaError.mockReturnValue(false);

    const response = await request(app)
      .post("/api/users/register")
      .send({
        username: "TestUser",
        email: "testuser@example.com",
        password: "password123",
      })
      .expect("Content-Type", /json/)
      .expect(500);

    expect(response.body).toEqual({
      error: `Failed to create user. Error: Database error`,
    });
  });
});
