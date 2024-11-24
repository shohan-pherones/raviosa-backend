import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import config from "../config/env";
import AppError from "../errors/app.error";
import { TUserRole } from "../modules/user/user.interface";
import UserModel from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt.util";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

const auth = (...roles: TUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }

      const { userId, role } = verifyToken(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;

      const user = await UserModel.findById(userId);

      if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
      }

      if (roles && !roles.includes(role)) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }

      req.user = { userId, role } as JwtPayload;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
