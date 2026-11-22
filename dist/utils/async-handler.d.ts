import type { Request, Response, NextFunction, RequestHandler } from "express";
type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
export declare const asyncHandler: (controller: AsyncController) => RequestHandler;
export {};
