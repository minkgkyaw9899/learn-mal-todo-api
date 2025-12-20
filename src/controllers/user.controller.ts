import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import argon2 from "argon2";
import { omit } from "es-toolkit";
import jwt from "jsonwebtoken";
import config from "../config";

export const getAllUser = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  res.json({
    meta: {
      status: 200,
      message: "success",
    },
    data: users,
  });
};

export const createUser = async (req: Request, res: Response) => {
  const body = req.body;

  const { name, email, password } = body;

  const hashPassword = await argon2.hash(password);

  const newUser = await prisma.user.create({
    data: { name, email, password: hashPassword },
  });

  const token = jwt.sign(
    {
      id: newUser.id,
    },
    config.jwtSecretKey
  );

  if (newUser.id) {
    return res.status(201).json({
      meta: {
        status: 201,
        message: "successfully created",
      },
      data: {
        user: omit(newUser, ["password"]),
        token,
      },
    });
  }
};
