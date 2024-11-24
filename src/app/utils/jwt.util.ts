import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/app.error";

export const createToken = (
    jwtPayload: { userId: string; role: string },
    secret: string,
    expiresIn: string
) => {
    return jwt.sign(jwtPayload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string) => {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid token");
        }
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError(StatusCodes.UNAUTHORIZED, "Token expired");
        }
        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Token verification failed"
        );
    }
};
