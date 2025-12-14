import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";
import { isPrismaError } from "../../lib/isPrismaError.js";

export const register = async (req: Request, res: Response) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);

    await prisma.user.create({
      data: {
        ...req.body,
        password,
      },
    });

    res.status(201).json({ data: "User created successfully." });
  } catch (error: unknown) {
    try {
      if (isPrismaError(error) && error.code === "P2002") {
        return res.status(409).json({ error: "User already exists." });
      }
    } catch (e) {
      console.error("Error handling Prisma error:", e);
    }

    console.error("Error creating user:", error);

    res.status(500).json({ error: `Failed to create user. ${error}` });
  }

  return res;
};
