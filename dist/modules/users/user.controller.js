import { userService } from "./user.service.js";
import { emailParamSchema, idParamSchema, profileSchema, signupSchema, signupQuerySchema, paginationQuerySchema, } from "./user.validation.js";
export const userController = {
    list: async (req, res) => res.json({
        success: true,
        message: "Users fetched successfully",
        ...(await userService.list(paginationQuerySchema.parse(req.query))),
    }),
    get: async (req, res) => {
        const { email } = emailParamSchema.parse(req.params);
        res.json(await userService.getByEmail(email));
    },
    adminCheck: async (req, res) => {
        const { email } = emailParamSchema.parse(req.params);
        res.json(await userService.isAdmin(email));
    },
    signup: async (req, res) => {
        const body = signupSchema.parse(req.body);
        const query = signupQuerySchema.safeParse(req.query);
        const email = query.success ? query.data.email : body.email;
        if (typeof email !== "string")
            return res
                .status(400)
                .json({ message: "A valid email query parameter is required" });
        return res.json(await userService.signup(email, body));
    },
    updateProfile: async (req, res) => {
        const { email } = emailParamSchema.parse(req.params);
        res.json(await userService.updateProfile(req, email, profileSchema.parse(req.body)));
    },
    promote: async (req, res) => {
        const { id } = idParamSchema.parse(req.params);
        res.json(await userService.promote(id));
    },
};
//# sourceMappingURL=user.controller.js.map