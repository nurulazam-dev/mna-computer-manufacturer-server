import { productService } from "./product.service.js";
import { productSchema, idParamSchema, purchaseParamSchema, paginationQuerySchema, } from "./product.validation.js";
export const productController = {
    list: async (req, res) => res.json({ success: true, message: "Products fetched successfully", ...(await productService.list(paginationQuerySchema.parse(req.query))) }),
    getPurchase: async (req, res) => {
        const { purchaseId } = purchaseParamSchema.parse(req.params);
        res.json(await productService.getPurchase(purchaseId));
    },
    create: async (req, res) => {
        const data = productSchema.parse(req.body);
        res.status(201).json(await productService.create(data));
    },
    remove: async (req, res) => {
        const { id } = idParamSchema.parse(req.params);
        res.json(await productService.remove(id));
    },
};
//# sourceMappingURL=product.controller.js.map