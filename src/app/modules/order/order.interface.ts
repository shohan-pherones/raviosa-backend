import { ObjectId } from "mongodb";
import { IProduct } from "../product/product.interface";
import { IUser } from "../user/user.interface";

export interface IOrderItem extends IProduct {
  quantity: number;
}

export interface IOrder {
  _id: ObjectId;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalPrice: number;
  items: IOrderItem[];
  user: IUser;
}
