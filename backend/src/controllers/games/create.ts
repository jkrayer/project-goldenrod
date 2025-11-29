import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const create = async (req: Request, res: Response) => {
  // get room data from request body
  const { name, description } = req.body;

  // Sanitize room data
  // to do, add xss sanitization

  // validate room data
  if (!name || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // add room to database
  try {
    const newRoom = await prisma.games.create({
      data: {
        name,
        description,
      },
    });

    // return success response
    res.status(201).json({ data: newRoom });
  } catch (error) {
    console.error("Error creating room:", error);

    return res.status(500).json({ error: "Internal server error" });
  }

  return res;
};
