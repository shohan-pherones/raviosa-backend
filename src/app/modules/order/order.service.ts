import { StatusCodes } from "http-status-codes";
import { startSession } from "mongoose";
import AppError from "../../errors/app.error";
import ProductModel from "../product/product.model";
import UserModel from "../user/user.model";
import { IConfirmOrderData, IOrder } from "./order.interface";
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

const getSingleOrderForConfirm = async (userId: string): Promise<IOrder> => {
  const order = await OrderModel.findOne({
    user: userId,
    status: "placed",
  })
    .sort({ createdAt: -1 })
    .populate(["items", "user"]);

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }

  return order;
};

const confirmOrder = async (
  confirmOrderData: IConfirmOrderData,
  orderId: string
): Promise<IOrder> => {
  const session = await startSession();

  try {
    session.startTransaction();

    const order = await OrderModel.findById(orderId).session(session);

    if (!order) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        `Order with ID ${orderId} not found`
      );
    }
    if (order.status !== "placed") {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Order with ID ${orderId} cannot be confirmed because it's not in "placed" status.`
      );
    }

    const { shippingDetails, items } = confirmOrderData;

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

      product.stock -= item.quantity;
      await product.save({ session });
    }

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          shippingDetails: {
            name: shippingDetails.name,
            email: shippingDetails.email,
            phone: shippingDetails.phone,
            address: shippingDetails.address,
            paymentMethod: shippingDetails.paymentMethod,
          },
          status: "confirmed",
        },
      },
      { new: true, session }
    );

    if (!updatedOrder) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        `Order with ID ${orderId} not found`
      );
    }

    await session.commitTransaction();
    return (await updatedOrder.populate(["items", "user"])).toObject();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const OrderServices = {
  createOrder,
  getSingleOrderForConfirm,
  confirmOrder,
};
