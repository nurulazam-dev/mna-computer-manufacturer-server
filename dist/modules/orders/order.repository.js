import { getCollections } from "../../config/collections.js";
import { objectId } from "../shared.js";
import { escapeRegex, getPagination, } from "../../utils/pagination.js";
export const orderRepository = {
    findAll: async (query) => {
        const { page, limit, search, sortBy, sortOrder } = query;
        const filter = search
            ? {
                $or: [
                    { customer: { $regex: escapeRegex(search), $options: "i" } },
                    { transactionId: { $regex: escapeRegex(search), $options: "i" } },
                ],
            }
            : {};
        const sortField = ["_id", "createdAt", "customer", "paid"].includes(sortBy ?? "")
            ? sortBy
            : "_id";
        const [data, total] = await Promise.all([
            getCollections()
                .orders.find(filter)
                .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray(),
            getCollections().orders.countDocuments(filter),
        ]);
        return { data, meta: getPagination(page, limit, total) };
    },
    findById: (id) => getCollections().orders.findOne({ _id: objectId(id) }),
    findByCustomer: async (email, query) => {
        const { page, limit } = query;
        const filter = { customer: email };
        const [data, total] = await Promise.all([
            getCollections()
                .orders.find(filter)
                .sort({ _id: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray(),
            getCollections().orders.countDocuments(filter),
        ]);
        return { data, meta: getPagination(page, limit, total) };
    },
    create: (data) => getCollections().orders.insertOne(data),
    updateById: (id, update) => getCollections().orders.updateOne({ _id: objectId(id) }, update),
    markPaid: (id, transactionId, session) => getCollections().orders.updateOne({ _id: id, paid: { $ne: true } }, { $set: { paid: true, transactionId } }, { session }),
    deleteById: (id) => getCollections().orders.deleteOne({ _id: objectId(id) }),
};
//# sourceMappingURL=order.repository.js.map