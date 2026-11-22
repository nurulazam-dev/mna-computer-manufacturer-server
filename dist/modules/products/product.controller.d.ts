import type { Request, Response } from "express";
export declare const productController: {
    list: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getPurchase: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    remove: (req: Request, res: Response) => Promise<void>;
};
