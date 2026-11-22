import { productRepository } from "./product.repository.js";
import { ApiError } from "../../utils/api-error.js";
export const productService = {
    list: (query) => productRepository.findAll(query),
    getPurchase: async (id) => {
        const product = await productRepository.findById(id);
        if (!product)
            throw new ApiError(404, "Product not found");
        return product;
    },
    create: (data) => productRepository.create(data),
    remove: async (id) => {
        const result = await productRepository.deleteById(id);
        if (!result.deletedCount)
            throw new ApiError(404, "Product not found");
        return result;
    },
};
//# sourceMappingURL=product.service.js.map