import { paymentService } from "./payment.service.js";
import { paymentIntentSchema } from "./payment.validation.js";
export const paymentController = {
    createIntent: async (req, res) => {
        const input = paymentIntentSchema.parse(req.body);
        if (!req.auth?.email)
            return res.status(401).json({ message: "Unauthorized access" });
        return res.json(await paymentService.createIntent(req.auth.email, input));
    },
};
//# sourceMappingURL=payment.controller.js.map