import { Router } from "express";
import { productRouter, productPurchaseRouter, } from "../modules/products/product.route.js";
import { orderRouter, ordersRouter } from "../modules/orders/order.route.js";
import { userRouter } from "../modules/users/user.route.js";
import { reviewRouter } from "../modules/reviews/review.route.js";
import { paymentRouter } from "../modules/payments/payment.route.js";
export const apiRouter = Router();
apiRouter.use("/products", productRouter);
apiRouter.use("/product", productPurchaseRouter);
apiRouter.use("/order", orderRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/", paymentRouter);
//# sourceMappingURL=index.js.map