import { Router } from "express";
import { orderController } from "./order.controller.js";
import { verifyJWT, requireAdmin } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sensitiveRateLimit } from "../../middlewares/rate-limit.middleware.js";

export const orderRouter = Router();

orderRouter.get("/", verifyJWT, asyncHandler(orderController.myOrders));

orderRouter.get("/:id", verifyJWT, asyncHandler(orderController.getOne));

orderRouter.post(
  "/",
  verifyJWT,
  sensitiveRateLimit,
  asyncHandler(orderController.create),
);

orderRouter.delete("/:id", verifyJWT, asyncHandler(orderController.cancel));

orderRouter.put(
  "/:id",
  verifyJWT,
  requireAdmin,
  asyncHandler(orderController.shipment),
);

export const ordersRouter = Router();

ordersRouter.get(
  "/",
  verifyJWT,
  requireAdmin,
  asyncHandler(orderController.listAll),
);

ordersRouter.put(
  "/:id",
  verifyJWT,
  asyncHandler(orderController.completePayment),
);
