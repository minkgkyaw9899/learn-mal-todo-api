import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../lib/prisma";
import argon2 from "argon2";
import { omit } from "es-toolkit";
import { createUser, findUserById, getAllUser } from "../models/user.model";
import { Conflict, InternalServerError, NotFound } from "http-errors";
import { successResponseFormatter } from "../lib/response-formatter";
import { signJwt } from "../lib/jwt";
import { type CreateUserSchema } from "../schemas/user.schema";

export const getAllUserController = async (req: Request, res: Response) => {
  const users = await getAllUser();

  return res.status(200).json(successResponseFormatter(users));
};

export const createUserController = async (
  req: Request<unknown, unknown, CreateUserSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    const { name, email, password } = body;

    const hashPassword = await argon2.hash(password);

    const newUser = await createUser({ name, email, password: hashPassword });

    const token = signJwt(newUser.id);

    return res.status(201).json(
      successResponseFormatter(
        {
          user: omit(newUser, ["password"]),
          token,
        },
        201,
        "Successfully created new user"
      )
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return next(Conflict("User Already exist"));
      }
    }
    return next(InternalServerError());
  }
};

export const getUserByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await findUserById(+id);

    if (!user) return next(NotFound("User not found"));

    return res.json(successResponseFormatter(omit(user, ["password"])));
  } catch (error) {
    return next(error);
  }
};
