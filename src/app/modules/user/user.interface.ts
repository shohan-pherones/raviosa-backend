import { ObjectId } from "mongodb";
import { IOrder } from "../order/order.interface";
import { USER_ROLE } from "./user.constant";

export interface IUser {
  _id: ObjectId;
  username: string;
  name: string;
  email: string;
  password: string;
  image: string;
  address: string;
  role: "user" | "admin";
  orders: IOrder[];
  createdAt: Date;
  updatedAt: Date;
}

export type TUserRole = keyof typeof USER_ROLE;
