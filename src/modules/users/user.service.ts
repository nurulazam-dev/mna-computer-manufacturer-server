import jwt from "jsonwebtoken";
import { userRepository } from "./user.repository.js";
import { ApiError } from "../../utils/api-error.js";
import { env } from "../../config/env.js";
import { requireOwnerOrAdmin } from "../../middlewares/auth.middleware.js";
import type { Request } from "express";
import type { AnyDoc } from "../shared.js";
import type { PaginationQuery } from "../../utils/pagination.js";

export const userService = {
  list: (query: PaginationQuery) => userRepository.findAll(query),

  getByEmail: async (email: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  },

  isAdmin: async (email: string) => ({
    admin: (await userRepository.findByEmail(email))?.role === "admin",
  }),

  signup: async (email: string, data: AnyDoc) => {
    const safeData = { ...data };
    delete safeData.role;
    delete safeData.isAdmin;
    delete safeData._id;

    const result = await userRepository.upsertByEmail(email, safeData);

    const token = jwt.sign({ email }, env.ACCESS_TOKEN_SECRET, {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    return { result, token };
  },

  updateProfile: async (req: Request, email: string, data: AnyDoc) => {
    await requireOwnerOrAdmin(req, email);

    const result = await userRepository.updateProfile(email, data);

    if (!result.matchedCount) throw new ApiError(404, "User not found");
    return result;
  },

  promote: async (id: string) => {
    const result = await userRepository.makeAdmin(id);

    if (!result.matchedCount) throw new ApiError(404, "User not found");
    return result;
  },
};
