import { reviewRepository } from "./review.repository.js";
import type { AnyDoc } from "../shared.js";
import type { PaginationQuery } from "../../utils/pagination.js";

export const reviewService = {
  list: (query: PaginationQuery) => reviewRepository.findAll(query),

  create: (data: AnyDoc) => reviewRepository.create(data),
};
