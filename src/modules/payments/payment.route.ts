import { Router } from "express";
import { paymentController } from "./payment.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const paymentRouter = Router();

paymentRouter.post(
  "/create-payment-intent",
  verifyJWT,
  asyncHandler(paymentController.createIntent),
);
