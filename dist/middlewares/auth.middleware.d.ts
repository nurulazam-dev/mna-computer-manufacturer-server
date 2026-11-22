import type { Request, Response, NextFunction } from "express";
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
export declare function verifyJWT(req: Request, res: Response, next: NextFunction): void;
export declare function requireAdmin(req: Request, _res: Response, next: NextFunction): Promise<void>;
export declare function requireOwnerOrAdmin(req: Request, email: string): Promise<void>;
