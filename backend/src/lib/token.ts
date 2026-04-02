import type { Request, Response, NextFunction } from "express";
import { compose, pathOr, propOr, split } from "ramda";
import jwt from "jsonwebtoken";
import { AppError } from "./AppError.js";
import { prisma } from "./prisma.js";

const SECRET = process.env.JWT_SECRET || "dangerous_default_secret";

/**
 * Extracts the JWT token from the Authorization header of an Express request.
 * Expects the header format to be "Bearer <token>".
 *
 * @param req - Express request object
 * @returns The JWT token string, or empty string if not found
 */
const getToken = compose<[Request], string, string[], string>(
  // @ts-expect-error - incorrect, prop can be a number
  propOr("", 1),
  split(" "),
  pathOr("", ["headers", "authorization"]),
);

/**
 * Generates a JWT token with the provided user payload.
 *
 * @param payload - Object containing user id
 * @param payload.id - The user's unique identifier
 * @returns A signed JWT token string valid for 6 hours
 */
export const generateToken = (payload: { id: number }) =>
  jwt.sign(payload, SECRET, {
    algorithm: "HS256",
    expiresIn: 1000 * 60 * 60 * 6, // 6 hours
    // notBefore: Date.now() + 1000 * 60 * 60 * 6, // 6 hours
    // algorithm?: Algorithm | undefined;
    // keyid?: string | undefined;
    // expiresIn?: StringValue | number;
    // notBefore?: StringValue | number | undefined;
    // audience?: string | string[] | undefined;
    // subject?: string | undefined;
    // issuer?: string | undefined;
    // jwtid?: string | undefined;
    // mutatePayload?: boolean | undefined;
    // noTimestamp?: boolean | undefined;
    // header?: JwtHeader | undefined;
    // encoding?: string | undefined;
    // allowInsecureKeySizes?: boolean | undefined;
    // allowInvalidAsymmetricKeyTypes?: boolean | undefined;
  });
// Date.now() + (1000 * 60 * 60 * 6); // 6 hours

/**
 * Express middleware that authenticates requests using JWT tokens.
 * Extracts the token from the Authorization header, verifies it, and attaches
 * the decoded user information (userId) to res.locals.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns Sends a 403 response with error message if authentication fails,
 *          otherwise calls next() to continue to the next middleware
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = getToken(req);
  let numericId: number | undefined;

  jwt.verify(token, SECRET, { algorithms: ["HS256"] }, (err, decoded) => {
    if (err) {
      return next(AppError(403, "InvalidToken", "Invalid or expired token"));
    } else if (!decoded || typeof decoded === "string") {
      return next(AppError(403, "InvalidToken", "Invalid token payload"));
    }

    const questionableId = (decoded as { id?: unknown }).id;

    if (typeof questionableId !== "number" || isNaN(questionableId)) {
      return next(
        AppError(403, "InvalidToken", "Token payload contains invalid ID"),
      );
    } else {
      numericId = questionableId;
    }
  });

  const user = await prisma.user.findUnique({
    where: { id: numericId! },
  });

  if (!user) {
    return next(
      AppError(403, "InvalidToken", "User associated with token not found"),
    );
  }

  res.locals.userId = user.id;

  next();
}

// For Socket
export async function authenticateTokenSocket(token?: string) {
  let numericId: number | undefined;

  console.log("Authenticating socket with token:", token);

  if (token === undefined) {
    return -1;
  }

  jwt.verify(token, SECRET, { algorithms: ["HS256"] }, (err, decoded) => {
    if (err) {
      return -1;
    } else if (!decoded || typeof decoded === "string") {
      return -1;
    }

    const questionableId = (decoded as { id?: unknown }).id;

    if (typeof questionableId !== "number" || isNaN(questionableId)) {
      return -1;
    } else {
      numericId = questionableId;
    }
  });

  const user = await prisma.user.findUnique({
    where: { id: numericId! },
  });

  if (!user) {
    return -1;
  }

  return user.id;
}
