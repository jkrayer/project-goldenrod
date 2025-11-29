/**
 * Type guard function that checks if an error object is a Prisma error.
 *
 * @param error - The error object to check
 * @returns True if the error is a Prisma error with a string code property, false otherwise
 *
 * @remarks
 * This function performs runtime type checking to determine if an unknown error
 * follows the Prisma error structure, which includes a `code` property of type string.
 *
 * @example
 * ```typescript
 * try {
 *   // some prisma operation
 * } catch (error) {
 *   if (isPrismaError(error)) {
 *     console.log(`Prisma error code: ${error.code}`);
 *   }
 * }
 * ```
 */
export const isPrismaError = (error: unknown): error is { code: string } =>
  error !== null &&
  typeof error === "object" &&
  "code" in error &&
  typeof error.code === "string";
