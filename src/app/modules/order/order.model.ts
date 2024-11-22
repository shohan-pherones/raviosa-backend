import mongoose, { Schema } from "mongoose";
import { IOrder } from "./order.interface";

const OrderSchema: Schema = new Schema<IOrder>(
  {
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
