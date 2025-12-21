import { error } from "node:console";
import { prisma, Prisma } from "../lib/prisma";
import type { CreateUserSchema } from "../schemas/user.schema";

export const getAllUser = async () => {
  try {
    return await prisma.user.findMany();
  } catch (err) {
    throw err;
  }
};

export const createUser = async ({
  name,
  email,
  password,
}: CreateUserSchema) => {
  return await prisma.user.create({
    data: { name, email, password },
  });
};

export const findUserById = async (id: number) => {
  return await prisma.user.findFirst({ where: { id } });
};
