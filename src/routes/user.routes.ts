import { Router } from "express";
import { createUser, getAllUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", getAllUser);

userRouter.get("/:id", getAllUser);

userRouter.post("/", createUser);

export default userRouter;
