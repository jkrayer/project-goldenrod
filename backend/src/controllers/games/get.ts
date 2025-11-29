import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const get = async (req: Request, res: Response) => {
  // get room data from request body
  const { id } = req.params;

  // Sanitize room data
  // to do, add xss sanitization

  // validate room data
  if (!id) {
    return res.status(400).json({ error: "Missing id in request parameters." });
  }

  // add room to database
  try {
    const room = await prisma.games.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found." });
    }

    // return success response
    res.status(200).json({ data: room });
  } catch (error) {
    console.error("Error retrieving room:", error);

    return res.status(500).json({ error: "Internal server error" });
  }

  return res;
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.games.findMany();

    res.status(200).json({ data: rooms });
  } catch (error) {
    console.error("Error retrieving rooms:", error);

    return res.status(500).json({ error: "Internal server error" });
  }

  return res;
};
