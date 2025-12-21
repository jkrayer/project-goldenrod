import type { Request, Response, NextFunction } from "express";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { errorHandler } from "./errorHandler.js";
import { AppError } from "./AppError.js";

describe("errorHandler", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let consoleErrorSpy: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should handle AppError with statusCode and status", () => {
    const error = new AppError("Test error", 400);

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Test error" });
    expect(consoleErrorSpy).toHaveBeenCalledWith("ERROR:", error);
  });

  it("should default to 500 status code when not provided", () => {
    const error = new AppError("Server error", 0);
    // @ts-expect-error - Force undefined statusCode
    error.statusCode = undefined;

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Server error" });
  });

  it('should default status to "error" when not provided', () => {
    const error = new AppError("Test error", 400);
    // @ts-expect-error - Force undefined status
    error.status = undefined;

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(error.status).toBe("error");
  });

  it("should log error to console", () => {
    const error = new AppError("Test error", 404);

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith("ERROR:", error);
  });

  it("should handle different status codes", () => {
    const testCases = [
      { statusCode: 400, message: "Bad Request" },
      { statusCode: 401, message: "Unauthorized" },
      { statusCode: 403, message: "Forbidden" },
      { statusCode: 404, message: "Not Found" },
    ];

    testCases.forEach(({ statusCode, message }) => {
      const error = new AppError(message, statusCode);
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      errorHandler(
        error,
        mockRequest as Request,
        response as unknown as Response,
        mockNext,
      );

      expect(response.status).toHaveBeenCalledWith(statusCode);
      expect(response.json).toHaveBeenCalledWith({ error: message });
    });
  });
});
