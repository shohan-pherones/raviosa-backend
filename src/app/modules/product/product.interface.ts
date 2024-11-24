import { ObjectId } from "mongodb";
import { ICategory } from "../category/category.interface";
import { IOrder } from "../order/order.interface";

export interface IProduct {
  _id: ObjectId;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  categories: ICategory[];
  orders: IOrder[];
  createdAt: Date;
  updatedAt: Date;
}
