import { model, Schema } from "mongoose";
import { IOrderedItems } from "./order.interface";

const orderedItemsSchema = new Schema<IOrderedItems>({
  orderId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Order",
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
});

const OrderedItemsModel = model<IOrderedItems>(
  "OrderedItems",
  orderedItemsSchema
);

export default OrderedItemsModel;
