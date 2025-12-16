import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken, prisma } from "../../lib/index.js";

export const login = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or email" });
    }

    const { id, password, ...data } = user;

    const match = await bcrypt.compare(req.body.password, password);

    if (!match) {
      return res.status(401).json({ error: "Invalid username or email" });
    }

    const token = generateToken({ id, role: user.role });

    res.status(200).json({ data, token });
  } catch (error) {
    console.error("Error logging in user:", error);

    return res.status(500).json({ error: "Internal server error" });
  }

  return res;
};
