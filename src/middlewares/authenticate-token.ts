import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verifyJwt } from "../lib/jwt";

export const authenticateToken = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return next(createHttpError.Unauthorized());

  const token = authHeader.split(" ")[1];

  if (!token) return next(createHttpError.Unauthorized());

  const decoded = verifyJwt(token);

  if (!decoded) return next(createHttpError.Unauthorized());

  req.user = decoded;

  return next();
};
