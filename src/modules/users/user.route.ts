import { Router } from "express";
import { userController } from "./user.controller.js";
import { verifyJWT, requireAdmin } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sensitiveRateLimit } from "../../middlewares/rate-limit.middleware.js";

export const userRouter = Router();

userRouter.get("/", verifyJWT, requireAdmin, asyncHandler(userController.list));

userRouter.get(
  "/admin/:email",
  verifyJWT,
  asyncHandler(userController.adminCheck),
);

userRouter.get("/:email", asyncHandler(userController.get));

userRouter.put("/", sensitiveRateLimit, asyncHandler(userController.signup));

userRouter.put(
  "/admin/:id",
  verifyJWT,
  requireAdmin,
  asyncHandler(userController.promote),
);

userRouter.put(
  "/:email",
  verifyJWT,
  asyncHandler(userController.updateProfile),
);
