import { getCollections } from "../../config/collections.js";
export const paymentRepository = {
    findByTransactionId: (transactionId, session) => getCollections().payments.findOne({ transactionId }, session ? { session } : undefined),
    create: (data, session) => getCollections().payments.insertOne(data, session ? { session } : undefined),
};
//# sourceMappingURL=payment.repository.js.map