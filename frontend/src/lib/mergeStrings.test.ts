import { describe, it, expect } from "@jest/globals";
import { mergeStrings } from "./mergeStrings";

describe("mergeStrings", () => {
  it("should merge simple strings with spaces", () => {
    const result = mergeStrings(["Hello", "World"]);
    expect(result).toBe("Hello World");
  });

  it("should filter out null values", () => {
    const result = mergeStrings(["Hello", null, "World"]);
    expect(result).toBe("Hello World");
  });

  it("should filter out undefined values", () => {
    const result = mergeStrings(["Hello", undefined, "World"]);
    expect(result).toBe("Hello World");
  });

  it("should filter out both null and undefined values", () => {
    const result = mergeStrings(["Hello", null, "World", undefined, "!"]);
    expect(result).toBe("Hello World !");
  });

  it("should trim leading and trailing whitespace", () => {
    const result = mergeStrings(["  Hello  ", "  World  "]);
    expect(result).toBe("Hello World");
  });

  it("should replace multiple consecutive spaces with single space", () => {
    const result = mergeStrings(["Hello", "  World"]);
    expect(result).toBe("Hello World");
  });

  it("should handle complex whitespace normalization", () => {
    const result = mergeStrings(["  foo  ", "bar  ", "  baz  "]);
    expect(result).toBe("foo bar baz");
  });

  it("should return empty string for array of only null/undefined", () => {
    const result = mergeStrings([null, undefined, null]);
    expect(result).toBe("");
  });

  it("should return empty string for empty array", () => {
    const result = mergeStrings([]);
    expect(result).toBe("");
  });

  it("should handle single string", () => {
    const result = mergeStrings(["Hello"]);
    expect(result).toBe("Hello");
  });

  it("should handle strings with multiple spaces between words", () => {
    const result = mergeStrings(["Hello    World", "Foo     Bar"]);
    expect(result).toBe("Hello World Foo Bar");
  });
});
