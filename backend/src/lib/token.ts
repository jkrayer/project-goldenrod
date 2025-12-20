import type { Request, Response, NextFunction } from "express";
import { compose, pathOr, propOr, split } from "ramda";
import jwt from "jsonwebtoken";
import type { User } from "@project_goldenrod/shared";

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
 * @param payload - Object containing user id and role
 * @param payload.id - The user's unique identifier
 * @param payload.role - The user's role from the User type
 * @returns A signed JWT token string valid for 6 hours
 */
export const generateToken = (payload: { id: number; role: User["role"] }) =>
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
 * the decoded user information (userId and userRole) to res.locals.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns Sends a 403 response with error message if authentication fails,
 *          otherwise calls next() to continue to the next middleware
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = getToken(req);
  console.log("Authenticating token:", token);

  jwt.verify(token, SECRET, { algorithms: ["HS256"] }, (err, decoded) => {
    if (err) {
      console.log("Authenticating token error:", err, decoded);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    if (!decoded || typeof decoded === "string") {
      console.log("Authenticating token decoded:", decoded);
      return res.status(403).json({ message: "Invalid token payload" });
    }

    console.log("Authenticating token success: attaching locals");
    res.locals.userId = decoded?.id || -1;
    res.locals.userRole = decoded?.role || "user";

    next();
  });
}
