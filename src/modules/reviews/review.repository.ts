import { getCollections } from "../../config/collections.js";
import type { AnyDoc } from "../shared.js";
import { getPagination, type PaginationQuery } from "../../utils/pagination.js";

export const reviewRepository = {
  findAll: async ({ page, limit, sortBy, sortOrder }: PaginationQuery) => {
    const sortField = ["_id", "createdAt"].includes(sortBy ?? "")
      ? sortBy!
      : "_id";

    const [data, total] = await Promise.all([
      getCollections()
        .reviews.find()
        .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      getCollections().reviews.countDocuments(),
    ]);

    return { data, meta: getPagination(page, limit, total) };
  },

  create: (data: AnyDoc) =>
    getCollections().reviews.insertOne({ ...data, createdAt: new Date() }),
};
