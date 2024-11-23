import { ObjectId } from "mongodb";
import { IProduct } from "../product/product.interface";
import { IUser } from "../user/user.interface";

export interface IOrderItem extends IProduct {
  quantity: number;
}

export interface IShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
}

export interface IOrder {
  _id: ObjectId;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalPrice: number;
  items: IOrderItem[];
  user: IUser;
  status:
    | "placed"
    | "confirmed"
    | "paid"
    | "processing"
    | "shipping"
    | "shipped"
    | "cancelled";
  shippingDetails?: IShippingDetails;
}

export interface IConfirmOrderData {
  shippingDetails: IShippingDetails;
  items: IOrderItem[];
}

export interface IOrderedItems {
  orderId: ObjectId;
  orderCosts: {
    subtotal: number;
    shippingCost: number;
    tax: number;
    totalPrice: number;
  };
  items: {
    product: ObjectId;
    quantity: number;
  }[];
}
