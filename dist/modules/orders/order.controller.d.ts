import type { Request, Response } from "express";
export declare const orderController: {
    listMine: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    listAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getOne: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    cancel: (req: Request, res: Response) => Promise<void>;
    shipment: (req: Request, res: Response) => Promise<void>;
    completePayment: (req: Request, res: Response) => Promise<void>;
};
