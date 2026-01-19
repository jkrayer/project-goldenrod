import { describe, expect, it } from "@jest/globals";
import { isPrismaError } from "./isPrismaError.js";

describe("isPrismaError", () => {
  it("should return true for valid Prisma error with string code", () => {
    const error = { code: "P2002" };
    expect(isPrismaError(error)).toBe(true);
  });

  it("should return false for null", () => {
    expect(isPrismaError(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isPrismaError(undefined)).toBe(false);
  });

  it("should return false for non-object types", () => {
    expect(isPrismaError("string")).toBe(false);
    expect(isPrismaError(123)).toBe(false);
    expect(isPrismaError(true)).toBe(false);
  });

  it("should return false for object without code property", () => {
    const error = { message: "Some error" };
    expect(isPrismaError(error)).toBe(false);
  });

  it("should return false for object with non-string code", () => {
    const error = { code: 123 };
    expect(isPrismaError(error)).toBe(false);
  });

  it("should return false for object with null code", () => {
    const error = { code: null };
    expect(isPrismaError(error)).toBe(false);
  });

  it("should return false for object with undefined code", () => {
    const error = { code: undefined };
    expect(isPrismaError(error)).toBe(false);
  });

  it("should return true for Error object with code property", () => {
    const error = new Error("Prisma error");
    // @ts-expect-error Adding code property for test purposes
    error.code = "P2025";
    expect(isPrismaError(error)).toBe(true);
  });

  it("should return true for object with additional properties", () => {
    const error = { code: "P2003", message: "Foreign key constraint failed" };
    expect(isPrismaError(error)).toBe(true);
  });
});
