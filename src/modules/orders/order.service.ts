import { orderRepository } from "./order.repository.js";
import { ApiError } from "../../utils/api-error.js";
import { requireOwnerOrAdmin } from "../../middlewares/auth.middleware.js";
import type { Request } from "express";
import type { AnyDoc } from "../shared.js";
import type { PaginationQuery } from "../../utils/pagination.js";
import { getMongoClient } from "../../config/database.js";
import { stripe } from "../../config/stripe.js";
import { paymentRepository } from "../payments/payment.repository.js";
function orderAmount(order: AnyDoc): number {
  const value = order.price ?? order.totalPrice ?? order.total ?? order.amount;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0)
    throw new ApiError(400, "Order has no valid payable amount");
  return Math.round(amount * 100);
}
export const orderService = {
  listMine: (email: string, query: PaginationQuery) =>
    orderRepository.findByCustomer(email, query),
  listAll: (query: PaginationQuery) => orderRepository.findAll(query),
  getOne: async (req: Request, id: string) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(404, "Order not found");
    await requireOwnerOrAdmin(req, String(order.customer ?? ""));
    return order;
  },
  create: async (email: string, data: AnyDoc) => {
    if (data.customer !== email)
      throw new ApiError(
        403,
        "Customer email does not match authenticated user",
      );
    return orderRepository.create(data);
  },
  cancel: async (req: Request, id: string) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(404, "Order not found");
    await requireOwnerOrAdmin(req, String(order.customer ?? ""));
    if (order.paid === true)
      throw new ApiError(409, "Paid orders cannot be cancelled");
    return orderRepository.deleteById(id);
  },
  markShipment: async (id: string) => {
    const result = await orderRepository.updateById(id, {
      $set: { shipment: true },
    });
    if (!result.matchedCount) throw new ApiError(404, "Order not found");
    return result;
  },
  completePayment: async (req: Request, id: string, payment: AnyDoc) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(404, "Order not found");
    await requireOwnerOrAdmin(req, String(order.customer ?? ""));
    if (order.paid === true) throw new ApiError(409, "Order is already paid");
    const intentId = String(
      payment.paymentIntentId ?? payment.transactionId ?? "",
    );
    if (!intentId.startsWith("pi_"))
      throw new ApiError(
        400,
        "A valid Stripe PaymentIntent id is required in transactionId",
      );
    const intent = await stripe.paymentIntents.retrieve(intentId);
    if (intent.status !== "succeeded")
      throw new ApiError(400, "Stripe payment has not succeeded");
    if (intent.currency !== "usd" || intent.amount !== orderAmount(order))
      throw new ApiError(
        400,
        "Payment amount or currency does not match the order",
      );
    if (intent.metadata.orderId && intent.metadata.orderId !== id)
      throw new ApiError(400, "PaymentIntent does not belong to this order");
    if (
      intent.metadata.customerEmail &&
      intent.metadata.customerEmail !== order.customer
    )
      throw new ApiError(
        400,
        "PaymentIntent customer does not match this order",
      );
    const mongoSession = getMongoClient().startSession();
    try {
      const updateResult = await mongoSession.withTransaction(async () => {
        const reusedPayment = await paymentRepository.findByTransactionId(
          intent.id,
          mongoSession,
        );
        if (reusedPayment)
          throw new ApiError(
            409,
            "This Stripe PaymentIntent has already been used",
          );
        const result = await orderRepository.markPaid(
          order._id,
          intent.id,
          mongoSession,
        );
        if (!result.matchedCount)
          throw new ApiError(
            409,
            "Order payment state changed; refresh and try again",
          );
        await paymentRepository.create(
          {
            ...payment,
            transactionId: intent.id,
            orderId: id,
            customer: order.customer,
            amount: intent.amount / 100,
            currency: intent.currency,
            createdAt: new Date(),
          },
          mongoSession,
        );
        return result;
      });
      if (!updateResult)
        throw new ApiError(500, "Payment transaction did not complete");
      return updateResult;
    } finally {
      await mongoSession.endSession();
    }
  },
};
