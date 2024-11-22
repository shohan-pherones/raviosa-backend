import { StatusCodes } from "http-status-codes";
import { startSession } from "mongoose";
import AppError from "../../errors/app.error";
import ProductModel from "../product/product.model";
import UserModel from "../user/user.model";
import { IOrder } from "./order.interface";
import OrderModel from "./order.model";

const createOrder = async (orderData: IOrder): Promise<IOrder> => {
  const session = await startSession();

  try {
    session.startTransaction();

    const { subtotal, shippingCost, tax, totalPrice, items, user } = orderData;

    for (const item of items) {
      const product = await ProductModel.findById(item._id).session(session);
      if (!product) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          `Product with ID ${item._id} not found`
        );
      }
      if (product.stock < item.quantity) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock for product ${product.name}`
        );
      }
    }

    const [order] = await OrderModel.create(
      [
        {
          subtotal,
          shippingCost,
          tax,
          totalPrice,
          items,
          user,
        },
      ],
      { session }
    );

    for (const item of items) {
      await ProductModel.updateOne(
        { _id: item._id },
        {
          $inc: { stock: -item.quantity },
          $push: { orders: order._id },
        },
        { session }
      );
    }

    await UserModel.updateOne(
      { _id: user._id },
      { $push: { orders: order._id } },
      { session }
    );

    await session.commitTransaction();
    return (await order.populate(["items", "user"])).toObject();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const OrderServices = {
  createOrder,
};
