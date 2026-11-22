import { ObjectId, type ClientSession } from "mongodb";
import { getCollections } from "../../config/collections.js";
import { objectId, type AnyDoc } from "../shared.js";
import {
  escapeRegex,
  getPagination,
  type PaginationQuery,
} from "../../utils/pagination.js";

export const orderRepository = {
  findAll: async (query: PaginationQuery) => {
    const { page, limit, search, sortBy, sortOrder } = query;
    const filter = search
      ? {
          $or: [
            { customer: { $regex: escapeRegex(search), $options: "i" } },
            { transactionId: { $regex: escapeRegex(search), $options: "i" } },
          ],
        }
      : {};
    const sortField = ["_id", "createdAt", "customer", "paid"].includes(
      sortBy ?? "",
    )
      ? sortBy!
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
  findById: (id: string) =>
    getCollections().orders.findOne({ _id: objectId(id) }),
  findByCustomer: async (email: string, query: PaginationQuery) => {
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
  create: (data: AnyDoc) => getCollections().orders.insertOne(data),
  updateById: (id: string, update: AnyDoc) =>
    getCollections().orders.updateOne({ _id: objectId(id) }, update),
  markPaid: (id: ObjectId, transactionId: string, session: ClientSession) =>
    getCollections().orders.updateOne(
      { _id: id, paid: { $ne: true } },
      { $set: { paid: true, transactionId } },
      { session },
    ),
  deleteById: (id: string) =>
    getCollections().orders.deleteOne({ _id: objectId(id) }),
};
