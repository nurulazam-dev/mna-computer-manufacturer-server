import { reviewRepository } from "./review.repository.js";
import type { AnyDoc } from "../shared.js";

export const reviewService = {
  list: () => reviewRepository.findAll(),
  create: (data: AnyDoc) => reviewRepository.create(data),
};
