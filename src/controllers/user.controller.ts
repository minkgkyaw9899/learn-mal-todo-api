import type { NextFunction, Request, Response } from "express";
import { omit } from "es-toolkit";
import {
  deleteUserById,
  findUserById,
  getAllUser,
  updateUserById,
} from "../models/user.model";
import { NotFound, InternalServerError } from "http-errors";
import { successResponseFormatter } from "../lib/response-formatter";
import type { IdParamSchema } from "../schemas/general.schema";
import type { UpdateUserSchema } from "../schemas/user.schema";

export const getAllUserController = async (req: Request, res: Response) => {
  const users = await getAllUser();

  return res.status(200).json(successResponseFormatter(users));
};

export const getUserByIdController = async (
  req: Request<IdParamSchema>,
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

export const updateUserByIdController = async (
  req: Request<IdParamSchema, unknown, UpdateUserSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const newUserData = req.body;

    const updatedUser = await updateUserById(+id, newUserData);

    if (!updatedUser) return next(NotFound("User not found!"));

    return res.status(200).json(
      successResponseFormatter(
        {
          user: omit(updatedUser, ["password"]),
        },
        201,
        "Successfully updated user"
      )
    );
  } catch (error) {
    return next(InternalServerError());
  }
};

export const deleteUserByIdController = async (
  req: Request<IdParamSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const updatedUser = await deleteUserById(+id);

    if (!updatedUser) return next(NotFound("User not found!"));

    return res.status(204);
  } catch (error) {
    return next(InternalServerError());
  }
};
