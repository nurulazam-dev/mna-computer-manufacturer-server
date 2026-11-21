import type { Request, Response } from "express";
import { userService } from "./user.service.js";
import type { AnyDoc } from "../shared.js";
import {
  emailParamSchema,
  idParamSchema,
  profileSchema,
  signupSchema,
  signupQuerySchema,
} from "./user.validation.js";

export const userController = {
  list: async (_req: Request, res: Response) =>
    res.json(await userService.list()),

  get: async (req: Request, res: Response) => {
    const { email } = emailParamSchema.parse(req.params);
    res.json(await userService.getByEmail(email));
  },

  adminCheck: async (req: Request, res: Response) => {
    const { email } = emailParamSchema.parse(req.params);
    res.json(await userService.isAdmin(email));
  },

  signup: async (req: Request, res: Response) => {
    const body = signupSchema.parse(req.body);
    const query = signupQuerySchema.safeParse(req.query);
    const email = query.success ? query.data.email : body.email;

    if (typeof email !== "string")
      return res
        .status(400)
        .json({ message: "A valid email query parameter is required" });

    return res.json(await userService.signup(email, body as AnyDoc));
  },

  updateProfile: async (req: Request, res: Response) => {
    const { email } = emailParamSchema.parse(req.params);
    res.json(
      await userService.updateProfile(
        req,
        email,
        profileSchema.parse(req.body) as AnyDoc,
      ),
    );
  },

  promote: async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    res.json(await userService.promote(id));
  },
};
