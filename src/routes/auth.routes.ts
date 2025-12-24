import { Router } from "express";
import { validator } from "../middlewares/validator";
import { createUserSchema } from "../schemas/user.schema";
import { idParamSchema } from "../schemas/general.schema";
import {
  signInController,
  signUpController,
} from "../controllers/auth.controller";
import { signInSchema } from "../schemas/auth.schema";

const authRouter = Router();

authRouter.post("/sign-in", validator(signInSchema), signInController);

authRouter.post("/sign-up", validator(createUserSchema), signUpController);

export default authRouter;
