import { Router } from "express";
import {
  createUserController,
  getAllUserController,
  getUserByIdController,
} from "../controllers/user.controller";
import { validator } from "../middlewares/validator";
import { createUserSchema } from "../schemas/user.schema";
import { idParamSchema } from "../schemas/general.schema";

const userRouter = Router();

userRouter.get("/", getAllUserController);

userRouter.get("/:id", validator(idParamSchema), getUserByIdController);

userRouter.post("/", validator(createUserSchema), createUserController);

export default userRouter;
