import { describe, expect, it } from "@jest/globals";
import { AppError } from "./AppError.js";

describe("AppError", () => {
  it("should create an error with default status code 500", () => {
    const error = new AppError("Something went wrong");

    expect(error.message).toBe("Something went wrong");
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe("error");
    expect(error.isOperational).toBe(true);
    expect(error.name).toBe("AppError");
  });

  it("should create an error with custom status code", () => {
    const error = new AppError("Not found", 404);

    expect(error.message).toBe("Not found");
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe("fail");
    expect(error.isOperational).toBe(true);
  });

  it('should set status to "fail" for 4xx status codes', () => {
    const error400 = new AppError("Bad request", 400);
    const error404 = new AppError("Not found", 404);
    const error403 = new AppError("Forbidden", 403);

    expect(error400.status).toBe("fail");
    expect(error404.status).toBe("fail");
    expect(error403.status).toBe("fail");
  });

  it('should set status to "error" for 5xx status codes', () => {
    const error500 = new AppError("Internal error", 500);
    const error502 = new AppError("Bad gateway", 502);
    const error503 = new AppError("Service unavailable", 503);

    expect(error500.status).toBe("error");
    expect(error502.status).toBe("error");
    expect(error503.status).toBe("error");
  });

  it("should extend Error class", () => {
    const error = new AppError("Test error", 400);

    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
  });

  it("should capture stack trace", () => {
    const error = new AppError("Test error", 400);

    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe("string");
  });
});
