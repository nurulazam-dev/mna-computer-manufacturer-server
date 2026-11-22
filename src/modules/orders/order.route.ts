import { Router } from "express";
import { orderController } from "./order.controller.js";
import { verifyJWT, requireAdmin } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sensitiveRateLimit } from "../../middlewares/rate-limit.middleware.js";

// Legacy customer/order routes are mounted at /order.
export const orderRouter = Router();
orderRouter.get("/", verifyJWT, asyncHandler(orderController.listMine));
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

// Legacy admin/payment routes are mounted at /orders.
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
