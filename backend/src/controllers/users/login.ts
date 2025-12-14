import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";

export const login = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      omit: { id: true },
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or email" });
    }

    const { password, ...data } = user;

    const match = await bcrypt.compare(req.body.password, password);

    if (!match) {
      return res.status(401).json({ error: "Invalid username or email" });
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error logging in user:", error);

    return res.status(500).json({ error: "Internal server error" });
  }

  return res;
};
