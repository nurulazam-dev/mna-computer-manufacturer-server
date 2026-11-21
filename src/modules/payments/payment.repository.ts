import type { ClientSession } from "mongodb";
import { getCollections } from "../../config/collections.js";

export const paymentRepository = {
  findByTransactionId: (transactionId: string, session?: ClientSession) =>
    getCollections().payments.findOne(
      { transactionId },
      session ? { session } : undefined,
    ),

  create: (data: Record<string, unknown>, session?: ClientSession) =>
    getCollections().payments.insertOne(
      data,
      session ? { session } : undefined,
    ),
};
