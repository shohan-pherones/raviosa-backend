import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AnyZodObject, ZodError } from "zod";

export const validate = (schema: AnyZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync({ ...req.body, ...req.cookies });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const simplifiedErrors = error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        }));

        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Validation failed", errors: simplifiedErrors });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  };
};
