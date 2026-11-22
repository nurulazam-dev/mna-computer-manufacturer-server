import type { Request, Response } from "express";
import { orderService } from "./order.service.js";
import {
  createOrderSchema,
  idParamSchema,
  orderQuerySchema,
  paymentUpdateSchema,
  paginationQuerySchema,
} from "./order.validation.js";
import { requireEmail, type AnyDoc } from "../shared.js";

export const orderController = {
  listMine: async (req: Request, res: Response) => {
    const { customer } = orderQuerySchema.parse(req.query);
    const pagination = paginationQuerySchema.parse(req.query);

    if (customer !== req.auth?.email)
      return res.status(403).json({ message: "Forbidden access" });

    return res.json({
      success: true,
      message: "My orders fetched successfully",
      ...(await orderService.listMine(customer, pagination)),
    });
  },

  listAll: async (req: Request, res: Response) =>
    res.json({
      success: true,
      message: "Orders fetched successfully",
      ...(await orderService.listAll(paginationQuerySchema.parse(req.query))),
    }),

  getOne: async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    res.json(await orderService.getOne(req, id));
  },

  create: async (req: Request, res: Response) => {
    const data = createOrderSchema.parse(req.body);
    res
      .status(201)
      .json(
        await orderService.create(
          requireEmail(req.auth?.email),
          data as AnyDoc,
        ),
      );
  },

  cancel: async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    res.json(await orderService.cancel(req, id));
  },

  shipment: async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    res.json(await orderService.markShipment(id));
  },

  completePayment: async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const payment = paymentUpdateSchema.parse(req.body);
    res.json(
      await orderService.completePayment(req, id, payment as unknown as AnyDoc),
    );
  },
};
