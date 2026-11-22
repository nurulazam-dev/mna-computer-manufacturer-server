import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { getCollections } from "../config/collections.js";
import { ApiError } from "../utils/api-error.js";
export function verifyJWT(req, res, next) {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) {
        res.status(401).json({ message: "Unauthorized access" });
        return;
    }
    try {
        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
        if (typeof decoded === "string" || typeof decoded.email !== "string") {
            res.status(403).json({ message: "Invalid token payload" });
            return;
        }
        req.auth = { email: decoded.email };
        next();
    }
    catch {
        res.status(403).json({ message: "Forbidden access" });
    }
}
export async function requireAdmin(req, _res, next) {
    try {
        if (!req.auth?.email)
            throw new ApiError(401, "Unauthorized access");
        const user = await getCollections().users.findOne({
            email: req.auth.email,
        });
        if (user?.role !== "admin")
            throw new ApiError(403, "Admin access required");
        next();
    }
    catch (error) {
        next(error);
    }
}
export async function requireOwnerOrAdmin(req, email) {
    if (req.auth?.email === email)
        return;
    const user = req.auth?.email
        ? await getCollections().users.findOne({ email: req.auth.email })
        : null;
    if (user?.role !== "admin")
        throw new ApiError(403, "Forbidden access");
}
//# sourceMappingURL=auth.middleware.js.map