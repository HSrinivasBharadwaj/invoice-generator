import { Request, Response } from "express";

/**
 * Type guard that ensures `req.user` exists. If absent, sends a 401 response.
 * Returns true when user is present and narrows type for downstream code.
 */
export function ensureUser(
  req: Request,
  res: Response
): req is Request & { user: NonNullable<Request['user']> } {
  if (!req.user) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}
