import type { Request, Response, NextFunction } from "express";
export declare function rateLimit(options: {
    windowMs: number;
    max: number;
    message?: string;
}): (req: Request, res: Response, next: NextFunction) => void;
export declare const apiRateLimit: (req: Request, res: Response, next: NextFunction) => void;
export declare const sensitiveRateLimit: (req: Request, res: Response, next: NextFunction) => void;
