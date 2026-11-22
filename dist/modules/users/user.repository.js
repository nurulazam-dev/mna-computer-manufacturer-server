import { getCollections } from "../../config/collections.js";
import { objectId } from "../shared.js";
import { escapeRegex, getPagination } from "../../utils/pagination.js";
export const userRepository = {
    findAll: async (query) => {
        const { page, limit, search, sortBy, sortOrder } = query;
        const filter = search ? { $or: [
                { name: { $regex: escapeRegex(search), $options: "i" } },
                { email: { $regex: escapeRegex(search), $options: "i" } },
                { role: { $regex: escapeRegex(search), $options: "i" } },
            ] } : {};
        const sortField = ["_id", "name", "email", "role", "createdAt"].includes(sortBy ?? "") ? sortBy : "_id";
        const projection = { password: 0, passwordHash: 0, resetToken: 0, resetOtp: 0, resetOtpHash: 0, refreshToken: 0, accessToken: 0, tokens: 0 };
        const [data, total] = await Promise.all([
            getCollections().users.find(filter, { projection }).sort({ [sortField]: sortOrder === "asc" ? 1 : -1 }).skip((page - 1) * limit).limit(limit).toArray(),
            getCollections().users.countDocuments(filter),
        ]);
        return { data, meta: getPagination(page, limit, total) };
    },
    findByEmail: (email) => getCollections().users.findOne({ email }, { projection: { password: 0, passwordHash: 0, resetToken: 0, resetOtp: 0, resetOtpHash: 0, refreshToken: 0, accessToken: 0, tokens: 0 } }),
    upsertByEmail: (email, data) => getCollections().users.updateOne({ email }, { $set: { ...data, email } }, { upsert: true }),
    updateProfile: (email, data) => getCollections().users.updateOne({ email }, { $set: data }),
    makeAdmin: (id) => getCollections().users.updateOne({ _id: objectId(id) }, { $set: { role: "admin" } }),
};
//# sourceMappingURL=user.repository.js.map