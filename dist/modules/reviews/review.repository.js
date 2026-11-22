import { getCollections } from "../../config/collections.js";
import { getPagination } from "../../utils/pagination.js";
export const reviewRepository = {
    findAll: async ({ page, limit, sortBy, sortOrder }) => {
        const sortField = ["_id", "createdAt"].includes(sortBy ?? "") ? sortBy : "_id";
        const [data, total] = await Promise.all([
            getCollections().reviews.find().sort({ [sortField]: sortOrder === "asc" ? 1 : -1 }).skip((page - 1) * limit).limit(limit).toArray(),
            getCollections().reviews.countDocuments(),
        ]);
        return { data, meta: getPagination(page, limit, total) };
    },
    create: (data) => getCollections().reviews.insertOne({ ...data, createdAt: new Date() }),
};
//# sourceMappingURL=review.repository.js.map