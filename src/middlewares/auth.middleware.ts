import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { getCollections } from "../config/collections.js";
import { ApiError } from "../utils/api-error.js";

export interface AuthPayload {
  email: string;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;

  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ message: "Unauthorized access" });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

    if (typeof decoded === "string" || typeof decoded.email !== "string") {
      res.status(403).json({ message: "Invalid token payload" });
      return;
    }

    req.auth = { email: decoded.email };
    next();
  } catch {
    res.status(403).json({ message: "Forbidden access" });
  }
}

export async function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.auth?.email) throw new ApiError(401, "Unauthorized access");

    const user = await getCollections().users.findOne({
      email: req.auth.email,
    });

    if (user?.role !== "admin")
      throw new ApiError(403, "Admin access required");

    next();
  } catch (error) {
    next(error);
  }
}

export async function requireOwnerOrAdmin(
  req: Request,
  email: string,
): Promise<void> {
  if (req.auth?.email === email) return;

  const user = req.auth?.email
    ? await getCollections().users.findOne({ email: req.auth.email })
    : null;

  if (user?.role !== "admin") throw new ApiError(403, "Forbidden access");
}
