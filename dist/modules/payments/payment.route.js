import { Router } from "express";
import { paymentController } from "./payment.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sensitiveRateLimit } from "../../middlewares/rate-limit.middleware.js";
export const paymentRouter = Router();
paymentRouter.post("/create-payment-intent", verifyJWT, sensitiveRateLimit, asyncHandler(paymentController.createIntent));
//# sourceMappingURL=payment.route.js.map