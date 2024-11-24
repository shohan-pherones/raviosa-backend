import { ObjectId } from "mongodb";
import { IProduct } from "../product/product.interface";

export interface ICategory {
  _id: ObjectId;
  name: string;
  products?: IProduct[];
  createdAt: Date;
  updatedAt: Date;
}
