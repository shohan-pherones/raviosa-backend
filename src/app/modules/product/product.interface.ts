import { ObjectId } from "mongodb";
import { ICategory } from "../category/category.interface";

export interface IProduct {
  _id: ObjectId;
  name: string;
  description: string;
  images?: string[];
  price: number;
  stock: number;
  categories: ICategory[];
  createdAt: Date;
  updatedAt: Date;
}
