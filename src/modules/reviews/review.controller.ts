import type { Request, Response } from "express";
import { reviewService } from "./review.service.js";
import type { AnyDoc } from "../shared.js";
import { reviewSchema } from "./review.validation.js";

export const reviewController = {
  list: async (_req: Request, res: Response) =>
    res.json(await reviewService.list()),

  create: async (req: Request, res: Response) => {
    const data = reviewSchema.parse(req.body);

    if (req.auth?.email) {
      data.customerEmail = req.auth.email;
      data.email = req.auth.email;
    }

    res.status(201).json(await reviewService.create(data as AnyDoc));
  },
};
