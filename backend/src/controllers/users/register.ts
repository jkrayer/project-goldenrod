import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { isPrismaError } from "../../lib/isPrismaError.js";
import { validateEmail, validateUsername } from "@project_goldenrod/shared";

export const register = async (req: Request, res: Response) => {
  // get user data from request body
  const { username, email } = req.body;

  // Sanitize user data
  // to do, add xss sanitization

  // validate user data
  if (!username || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!validateUsername(username)) {
    return res
      .status(400)
      .json({ error: "Invalid username (3-20 alphanumeric characters)" });
  }

  // add user to database
  try {
    const newUser = await prisma.user.create({
      data: {
        userName: username,
        email,
        // password -- auth not added yet
      },
    });
    res.status(201).json({ data: newUser });
  } catch (error: unknown) {
    try {
      if (isPrismaError(error) && error.code === "P2002") {
        return res.status(409).json({ error: "User already exists." });
      }
    } catch (e) {
      console.error("Error handling Prisma error:", e);
    }

    console.error("Error creating user:", error);

    // Handle specific Prisma errors if needed, like user already exists

    res.status(500).json({ error: `Failed to create user. ${error}` });
  }

  return res;
};
