import jwt from "jsonwebtoken";
import { userRepository } from "./user.repository.js";
import { ApiError } from "../../utils/api-error.js";
import { env } from "../../config/env.js";
import { requireOwnerOrAdmin } from "../../middlewares/auth.middleware.js";
export const userService = {
    list: (query) => userRepository.findAll(query),
    getByEmail: async (email) => {
        const user = await userRepository.findByEmail(email);
        if (!user)
            throw new ApiError(404, "User not found");
        return user;
    },
    isAdmin: async (email) => ({
        admin: (await userRepository.findByEmail(email))?.role === "admin",
    }),
    signup: async (email, data) => {
        const safeData = { ...data };
        delete safeData.role;
        delete safeData.isAdmin;
        delete safeData._id;
        const result = await userRepository.upsertByEmail(email, safeData);
        const token = jwt.sign({ email }, env.ACCESS_TOKEN_SECRET, {
            expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
        });
        return { result, token };
    },
    updateProfile: async (req, email, data) => {
        await requireOwnerOrAdmin(req, email);
        const result = await userRepository.updateProfile(email, data);
        if (!result.matchedCount)
            throw new ApiError(404, "User not found");
        return result;
    },
    promote: async (id) => {
        const result = await userRepository.makeAdmin(id);
        if (!result.matchedCount)
            throw new ApiError(404, "User not found");
        return result;
    },
};
//# sourceMappingURL=user.service.js.map