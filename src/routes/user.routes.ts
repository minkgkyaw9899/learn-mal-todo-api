import { Router } from "express";
import {
  getAllUserController,
  getUserByIdController,
  updateUserByIdController,
} from "../controllers/user.controller";
import { validator } from "../middlewares/validator";
import { idParamSchema } from "../schemas/general.schema";
import { updateUserSchema } from "../schemas/user.schema";

const userRouter = Router();

userRouter.get("/", getAllUserController);

userRouter.get("/:id", validator(idParamSchema), getUserByIdController);

userRouter.patch(
  "/:id",
  validator(idParamSchema),
  validator(updateUserSchema),
  updateUserByIdController
);

export default userRouter;
