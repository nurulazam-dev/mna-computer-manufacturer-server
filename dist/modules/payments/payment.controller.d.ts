import type { Request, Response } from "express";
export declare const paymentController: {
    createIntent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
