import { reviewService } from "./review.service.js";
import { reviewSchema, paginationQuerySchema } from "./review.validation.js";
export const reviewController = {
    list: async (req, res) => res.json({ success: true, message: "Reviews fetched successfully", ...(await reviewService.list(paginationQuerySchema.parse(req.query))) }),
    create: async (req, res) => {
        const data = reviewSchema.parse(req.body);
        if (req.auth?.email) {
            data.customerEmail = req.auth.email;
            data.email = req.auth.email;
        }
        res.status(201).json(await reviewService.create(data));
    },
};
//# sourceMappingURL=review.controller.js.map