import type { Request, Response } from "express";

// If the authenticateToken middleware passed then this must be valid
export const verify = async (req: Request, res: Response) => {
  res.status(200).json({ data: { valid: true } });
};
