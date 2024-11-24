"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderedItemsSchema = new mongoose_1.Schema({
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Order",
    },
    orderCosts: {
        subtotal: { type: Number, required: true },
        shippingCost: { type: Number, required: true },
        tax: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
    },
    items: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
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
const OrderedItemsModel = (0, mongoose_1.model)(
    "OrderedItems",
    orderedItemsSchema
);
exports.default = OrderedItemsModel;
