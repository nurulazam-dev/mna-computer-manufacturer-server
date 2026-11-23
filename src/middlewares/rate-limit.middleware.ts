import type { Request, Response, NextFunction } from "express";

type Entry = { count: number; resetAt: number };
const stores = new Map<string, Entry>();

const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of stores)
    if (entry.resetAt <= now) stores.delete(key);
}, 60_000);
cleanup.unref();

export function rateLimit(options: {
  windowMs: number;
  max: number;
  message?: string;
}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${req.ip ?? req.socket.remoteAddress ?? "unknown"}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    let entry = stores.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + options.windowMs };
      stores.set(key, entry);
    }
    entry.count += 1;

    const remaining = Math.max(0, options.max - entry.count);
    res.setHeader("RateLimit-Limit", options.max);
    res.setHeader("RateLimit-Remaining", remaining);
    res.setHeader("RateLimit-Reset", Math.ceil(entry.resetAt / 1000));

    if (entry.count > options.max) {
      res.setHeader(
        "Retry-After",
        Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
      );
      res.status(429).json({
        success: false,
        message:
          options.message ?? "Too many requests. Please try again later.",
      });
      return;
    }
    next();
  };
}

export const apiRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });

export const sensitiveRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many requests. Please try again after 15 minutes.",
});
