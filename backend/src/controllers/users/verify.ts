import type { Request, Response } from "express";

export const verify = async (req: Request, res: Response) => {
  // const { userId, userRole } = res.locals;

  res.status(200).json({ data: { valid: true } });
};
