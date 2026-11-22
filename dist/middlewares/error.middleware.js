import { ApiError } from "../utils/api-error.js";
import { MongoServerError } from "mongodb";
import { ZodError } from "zod";
export function errorHandler(error, _req, res, _next) {
    if (res.headersSent)
        return;
    const status = error instanceof ApiError
        ? error.statusCode
        : error instanceof ZodError
            ? 400
            : error instanceof MongoServerError && error.code === 11000
                ? 409
                : 500;
    const message = error instanceof ZodError
        ? error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join("; ")
        : error instanceof Error
            ? error.message
            : "Internal server error";
    if (status === 500)
        console.error(error);
    res.status(status).json({
        success: false,
        message: status === 500 && process.env.NODE_ENV === "production"
            ? "Internal server error"
            : message,
    });
}
//# sourceMappingURL=error.middleware.js.map