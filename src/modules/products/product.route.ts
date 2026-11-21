import { Router } from "express";
import { productController } from "./product.controller.js";
import { verifyJWT, requireAdmin } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const productRouter = Router();

export const productPurchaseRouter = Router();

productRouter.get("/", asyncHandler(productController.list));

productRouter.post(
  "/",
  verifyJWT,
  requireAdmin,
  asyncHandler(productController.create),
);

productRouter.delete(
  "/:id",
  verifyJWT,
  requireAdmin,
  asyncHandler(productController.remove),
);

productPurchaseRouter.get(
  "/purchase/:purchaseId",
  verifyJWT,
  asyncHandler(productController.getPurchase),
);
