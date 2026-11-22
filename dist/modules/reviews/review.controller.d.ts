import type { Request, Response } from "express";
export declare const reviewController: {
    list: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    create: (req: Request, res: Response) => Promise<void>;
};
