import { Router } from "express";
import { validator } from "../middlewares/validator";
import {
  createTodoController,
  deleteTodoByIdController,
  getAllTodoController,
  getTodoByIdController,
  updateTodoByIdController,
} from "../controllers/todo.controller";
import { createTodoSchema, updateTodoSchema } from "../schemas/todo.schema";
import { idParamSchema } from "../schemas/general.schema";

const todoRouter = Router();

todoRouter.get("/", getAllTodoController);

todoRouter.post("/", validator(createTodoSchema), createTodoController);

todoRouter.get("/:id", validator(idParamSchema), getTodoByIdController);

todoRouter.patch(
  "/:id",
  validator(idParamSchema),
  validator(updateTodoSchema),
  updateTodoByIdController
);

todoRouter.delete("/:id", validator(idParamSchema), deleteTodoByIdController);

export default todoRouter;
