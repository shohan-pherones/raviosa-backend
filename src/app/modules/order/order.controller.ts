import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { OrderServices } from "./order.service";

const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderData = req.body;
    const order = await OrderServices.createOrder(orderData);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Order created successfully", order });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const OrderControllers = {
  createOrder,
};
