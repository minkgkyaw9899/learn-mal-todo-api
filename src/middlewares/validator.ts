import type { NextFunction, Request, Response } from "express";
import { UnprocessableEntity } from "http-errors";
import { z, type ZodObject } from "zod";

export const validator =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      return next();
    } catch (error) {
      console.log("error", error);
      if (error instanceof z.core.$ZodError) {
        console.log(error.issues);
        if (error.issues.length > 0) {
          return next(UnprocessableEntity(error.issues[0]?.message));
        }
      }
    }
  };
