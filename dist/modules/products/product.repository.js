import { getCollections } from "../../config/collections.js";
import { objectId } from "../shared.js";
import { escapeRegex, getPagination } from "../../utils/pagination.js";
export const productRepository = {
    findAll: async (query) => {
        const { page, limit, search, sortBy, sortOrder } = query;
        const filter = search ? { $or: [
                { name: { $regex: escapeRegex(search), $options: "i" } },
                { category: { $regex: escapeRegex(search), $options: "i" } },
                { brand: { $regex: escapeRegex(search), $options: "i" } },
            ] } : {};
        const sortField = ["_id", "name", "price", "createdAt"].includes(sortBy ?? "") ? sortBy : "_id";
        const [data, total] = await Promise.all([
            getCollections().products.find(filter).sort({ [sortField]: sortOrder === "asc" ? 1 : -1 }).skip((page - 1) * limit).limit(limit).toArray(),
            getCollections().products.countDocuments(filter),
        ]);
        return { data, meta: getPagination(page, limit, total) };
    },
    findById: (id) => getCollections().products.findOne({ _id: objectId(id) }),
    create: (data) => getCollections().products.insertOne(data),
    deleteById: (id) => getCollections().products.deleteOne({ _id: objectId(id) }),
};
//# sourceMappingURL=product.repository.js.map