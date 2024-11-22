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

const getSingleOrderForConfirm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.user;
    const order = await OrderServices.getSingleOrderForConfirm(userId);

    res
      .status(StatusCodes.OK)
      .json({ message: "Order retrieved successfully", order });
  } catch (error: any) {
    res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
  }
};

const confirmOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const order = await OrderServices.confirmOrder(req.body, orderId);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Order has been confirmed", order });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const OrderControllers = {
  createOrder,
  getSingleOrderForConfirm,
  confirmOrder,
};
