import type { Request, Response } from "express";
export declare const userController: {
    list: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    get: (req: Request, res: Response) => Promise<void>;
    adminCheck: (req: Request, res: Response) => Promise<void>;
    signup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateProfile: (req: Request, res: Response) => Promise<void>;
    promote: (req: Request, res: Response) => Promise<void>;
};
