import { Router } from "express";
import { reviewController } from "./review.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sensitiveRateLimit } from "../../middlewares/rate-limit.middleware.js";

export const reviewRouter = Router();

reviewRouter.get("/", asyncHandler(reviewController.list));

reviewRouter.post(
  "/",
  verifyJWT,
  sensitiveRateLimit,
  asyncHandler(reviewController.create),
);
