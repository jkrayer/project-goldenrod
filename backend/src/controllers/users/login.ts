import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const login = async (req: Request, res: Response) => {
  // get user data from request body
  const { username, email } = req.body;

  // Sanitize user data
  // to do, add xss sanitization

  // validate user data
  if (!username || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // add user to database
  try {
    const user = await prisma.user.findFirst({
      where: {
        userName: username,
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or email" });
    }

    // return success response
    res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error logging in user:", error);

    return res.status(500).json({ error: "Internal server error" });
  }

  return res;
};
