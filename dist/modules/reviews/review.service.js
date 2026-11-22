import { reviewRepository } from "./review.repository.js";
export const reviewService = {
    list: (query) => reviewRepository.findAll(query),
    create: (data) => reviewRepository.create(data),
};
//# sourceMappingURL=review.service.js.map