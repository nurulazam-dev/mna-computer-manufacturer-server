import type { Request, Response } from "express";
import { productService } from "./product.service.js";
import type { AnyDoc } from "../shared.js";
import {
  productSchema,
  idParamSchema,
  purchaseParamSchema,
} from "./product.validation.js";

export const productController = {
  list: async (_req: Request, res: Response) =>
    res.json(await productService.list()),

  getPurchase: async (req: Request, res: Response) => {
    const { purchaseId } = purchaseParamSchema.parse(req.params);
    res.json(await productService.getPurchase(purchaseId));
  },

  create: async (req: Request, res: Response) => {
    const data = productSchema.parse(req.body);
    res.status(201).json(await productService.create(data as AnyDoc));
  },

  remove: async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    res.json(await productService.remove(id));
  },
};
