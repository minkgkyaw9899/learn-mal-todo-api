import { prisma } from "../lib/prisma";
import type {
  CreateTodoSchema,
  UpdateTodoSchema,
} from "../schemas/todo.schema";

export const getAllTodo = async () => {
  return await prisma.todo.findMany();
};

export const getAllTodoByUserId = async (userId: number) => {
  return await prisma.todo.findMany({ where: { authorId: userId } });
};

export const findTodoById = async (id: number) => {
  return await prisma.todo.findUnique({ where: { id } });
};

export const findTodoByCompletedForUserId = async (userId: number) => {
  return await prisma.todo.findMany({
    where: { authorId: userId, isCompleted: true },
  });
};

export const createTodo = async (userId: number, data: CreateTodoSchema) => {
  return await prisma.todo.create({ data: { ...data, authorId: userId } });
};

export const updateTodo = async (id: number, data: UpdateTodoSchema) => {
  return await prisma.todo.update({
    where: { id },
    data,
  });
};

export const deleteTodo = async (id: number) => {
  return await prisma.todo.delete({
    where: { id },
  });
};
