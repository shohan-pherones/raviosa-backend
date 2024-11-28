import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import config from "../../config/env";
import AppError from "../../errors/app.error";
import { createToken, verifyToken } from "../../utils/jwt.util";
import { IUser } from "./user.interface";
import UserModel from "./user.model";

const register = async (userData: IUser) => {
  const existingUser = await UserModel.findOne({ email: userData.email });

  if (existingUser) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "User with this email already exists"
    );
  }

  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const user = new UserModel({
    ...userData,
    password: hashedPassword,
  });

  await user.save();

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return { accessToken, refreshToken, user };
};

const login = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "User with this email does not exist"
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(StatusCodes.FORBIDDEN, "Incorrect password");
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return { accessToken, refreshToken, user };
};

const refreshToken = async (token: string) => {
  try {
    const { userId } = verifyToken(token, config.jwt_refresh_secret as string);

    if (!userId) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid token payload");
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    const jwtPayload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    );

    return { accessToken, user };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong during token refresh"
    );
  }
};

const getAllUsers = async (): Promise<IUser[]> => {
  const users = await UserModel.find();

  if (!users) {
    throw new AppError(StatusCodes.NOT_FOUND, "No user found");
  }

  return users;
};

const getAnUser = async (userId: string): Promise<IUser> => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};

const updateAnUser = async (userId: string, userData: Partial<IUser>) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: userData },
    { new: true }
  );

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return { accessToken, refreshToken, user };
};

const changeUserRole = async (userId: string, role: string) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { role } },
    { new: true }
  );

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};

export const UserServices = {
  register,
  login,
  refreshToken,
  getAllUsers,
  getAnUser,
  updateAnUser,
  changeUserRole,
};
