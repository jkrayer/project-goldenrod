// At the top of the file
export const isPrismaError = (error: unknown): error is { code: string } =>
  error !== null &&
  typeof error === "object" &&
  "code" in error &&
  typeof error.code === "string";
