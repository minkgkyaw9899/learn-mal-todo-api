import type { NextFunction, Request, Response } from "express";
import { createUser, findUserByEmail } from "../models/user.model";
import { successResponseFormatter } from "../lib/response-formatter";
import argon2 from "argon2";
import { Conflict, InternalServerError, Unauthorized } from "http-errors";
import { signJwt } from "../lib/jwt";
import { omit } from "es-toolkit";
import type { CreateUserSchema } from "../schemas/user.schema";
import { Prisma } from "../lib/prisma";
import type { SignInSchema } from "../schemas/auth.schema";

export const signInController = async (
  req: Request<unknown, unknown, SignInSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) return next(Unauthorized("Invalid credential or email"));

    const isMatchPwd = argon2.verify(password, user?.password);

    if (!isMatchPwd) return next(Unauthorized("Invalid credential or email"));

    const token = signJwt(user.id);

    return res.status(200).json(
      successResponseFormatter(
        {
          user: omit(user, ["password"]),
          token,
        },
        201,
        "Successfully sign up"
      )
    );
  } catch (err) {
    console.log("error", err);
    return next(InternalServerError());
  }
};

export const signUpController = async (
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
