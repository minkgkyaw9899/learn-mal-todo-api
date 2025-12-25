import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { getCache, removeCache, setCache } from "../lib/redis";
import { successResponseFormatter } from "../lib/response-formatter";
import {
  createTodo,
  deleteTodo,
  findTodoById,
  getAllTodoByUserId,
  updateTodo,
} from "../models/todo.model";
import type {
  CreateTodoSchema,
  UpdateTodoSchema,
} from "../schemas/todo.schema";
import type { IdParamSchema } from "../schemas/general.schema";
import { Prisma } from "../lib/prisma";

export const getAllTodoController = async (
  req: Request<unknown>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) return next(createHttpError.Forbidden());

  const id = user.id;
  const cacheKey = `todo_for_user_${id}`;
  try {
    const cachedTodo = await getCache(cacheKey);

    if (cachedTodo)
      return res.json(successResponseFormatter(JSON.parse(cachedTodo)));

    const todo = await getAllTodoByUserId(id);

    setCache(cacheKey, todo);

    return res.json(successResponseFormatter(todo));
  } catch (err) {
    return next(createHttpError.InternalServerError());
  }
};

export const getTodoByIdController = async (
  req: Request<IdParamSchema>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) return next(createHttpError.Forbidden());

  const userId = user.id;
  const id = req.params.id;

  const cacheKey = `todo_${id}_for_user_${userId}`;
  try {
    const cachedTodo = await getCache(cacheKey);

    if (cachedTodo)
      return res.json(successResponseFormatter(JSON.parse(cachedTodo)));

    const todo = await findTodoById(+id);

    setCache(cacheKey, todo);

    return res.json(successResponseFormatter(todo));
  } catch (err) {
    return next(createHttpError.InternalServerError());
  }
};

export const updateTodoByIdController = async (
  req: Request<IdParamSchema, unknown, UpdateTodoSchema>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) return next(createHttpError.Forbidden());

  const userId = user.id;

  const id = req.params.id;

  const todoByIdCacheKey = `todo_${id}_for_user_${userId}`;
  const allTodoCacheKey = `todo_for_user_${id}`;
  try {
    await removeCache(todoByIdCacheKey);
    await removeCache(allTodoCacheKey);

    const data = req.body;
    const todo = await updateTodo(+id, data);

    setCache(todoByIdCacheKey, todo);

    return res.json(successResponseFormatter(todo));
  } catch (err) {
    return next(createHttpError.InternalServerError());
  }
};

export const deleteTodoByIdController = async (
  req: Request<IdParamSchema, unknown>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) return next(createHttpError.Forbidden());

  const userId = user.id;

  const id = req.params.id;

  const todoByIdCacheKey = `todo_${id}_for_user_${userId}`;
  const allTodoCacheKey = `todo_for_user_${id}`;
  try {
    await removeCache(todoByIdCacheKey);
    await removeCache(allTodoCacheKey);

    await deleteTodo(+id);

    return res.status(204);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return next(createHttpError.NotFound("Todo not found!"));
      }
    }
    return next(createHttpError.InternalServerError());
  }
};

export const createTodoController = async (
  req: Request<unknown, unknown, CreateTodoSchema>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) return next(createHttpError.Forbidden());

  const id = user.id;
  const cacheKey = `todo_for_user_${id}`;

  try {
    const data = req.body;

    removeCache(cacheKey);

    const newTodo = await createTodo(id, data);

    if (!newTodo) return next(createHttpError.BadRequest());

    return res.status(201).json(successResponseFormatter(newTodo));
  } catch (error) {
    return next(createHttpError.InternalServerError());
  }
};
