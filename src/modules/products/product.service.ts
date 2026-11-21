import { productRepository } from "./product.repository.js";
import { ApiError } from "../../utils/api-error.js";
import type { AnyDoc } from "../shared.js";

export const productService = {
  list: () => productRepository.findAll(),

  getPurchase: async (id: string) => {
    const product = await productRepository.findById(id);
    if (!product) throw new ApiError(404, "Product not found");
    return product;
  },

  create: (data: AnyDoc) => productRepository.create(data),

  remove: async (id: string) => {
    const result = await productRepository.deleteById(id);
    if (!result.deletedCount) throw new ApiError(404, "Product not found");
    return result;
  },
};
