import mongoose, { Schema } from "mongoose";
import { IProduct } from "./product.interface";

const ProductSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
