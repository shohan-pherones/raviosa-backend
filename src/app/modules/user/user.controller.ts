import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import config from "../../config/env";
import AppError from "../../errors/app.error";
import { UserServices } from "./user.service";

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accessToken, refreshToken, user } = await UserServices.register(
      req.body
    );

    res.cookie("refreshToken", refreshToken, {
      secure: config.node_env === "production",
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "User registered successfully", accessToken, user });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await UserServices.login(
      email,
      password
    );

    res.cookie("refreshToken", refreshToken, {
      secure: config.node_env === "production",
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    res
      .status(StatusCodes.OK)
      .json({ message: "User logged in successfully", accessToken, user });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.cookies;
  const { accessToken } = await UserServices.refreshToken(refreshToken);

  res
    .status(StatusCodes.OK)
    .json({ message: "Access token retrieved successfully", accessToken });
};

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserServices.getAllUsers();

    res
      .status(StatusCodes.OK)
      .json({ message: "Users retrieved successfully", users });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const getAnUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await UserServices.getAnUser(userId);

    res
      .status(StatusCodes.OK)
      .json({ message: "User retrieved successfully", user });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const updateAnUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { userId: loggedInUserId } = req.user;

    if (userId !== loggedInUserId) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "You are not authorized to update this user"
      );
    }

    const { username, name, image, address } = req.body;

    const updatedUser = await UserServices.updateAnUser(userId, {
      username,
      name,
      image,
      address,
    });

    res
      .status(StatusCodes.OK)
      .json({ message: "User updated successfully", updatedUser });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const UserControllers = {
  register,
  login,
  refreshToken,
  getAllUsers,
  getAnUser,
  updateAnUser,
};
