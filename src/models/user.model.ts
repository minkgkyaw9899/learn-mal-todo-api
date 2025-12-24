import { prisma } from "../lib/prisma";
import type {
  CreateUserSchema,
  UpdateUserSchema,
} from "../schemas/user.schema";

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

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({ where: { email } });
};

export const updateUserById = async (id: number, data: UpdateUserSchema) => {
  return await prisma.user.update({ where: { id }, data });
};

export const deleteUserById = async (id: number) => {
  return await prisma.user.delete({ where: { id } });
};
