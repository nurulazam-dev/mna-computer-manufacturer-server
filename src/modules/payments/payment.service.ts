import { stripe } from "../../config/stripe.js";
import { getCollections } from "../../config/collections.js";
import { objectId } from "../shared.js";
import { ApiError } from "../../utils/api-error.js";

export const paymentService = {
  createIntent: async (
    email: string,
    input: { shouldPay?: number; amount?: number; orderId?: string },
  ) => {
    let amount = input.amount ?? input.shouldPay;
    let orderId: string | undefined;

    if (input.orderId) {
      const order = await getCollections().orders.findOne({
        _id: objectId(input.orderId),
      });

      if (!order) throw new ApiError(404, "Order not found");
      if (order.customer !== email) throw new ApiError(403, "Forbidden access");

      const orderAmount = Number(
        order.price ?? order.totalPrice ?? order.total ?? order.amount,
      );

      if (!Number.isFinite(orderAmount) || orderAmount <= 0)
        throw new ApiError(400, "Order has no valid payable amount");

      amount = orderAmount;
      orderId = input.orderId;
    }

    if (
      !Number.isFinite(amount) ||
      Number(amount) <= 0 ||
      Number(amount) > 999999.99
    )
      throw new ApiError(400, "Invalid payment amount");

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { customerEmail: email, ...(orderId ? { orderId } : {}) },
    });

    return { clientSecret: intent.client_secret, paymentIntentId: intent.id };
  },
};
