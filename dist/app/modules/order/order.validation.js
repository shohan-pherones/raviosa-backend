"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidations = void 0;
const zod_1 = require("zod");
const productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Product name is required." }),
    description: zod_1.z
        .string()
        .min(1, { message: "Product description is required." }),
    image: zod_1.z.string().url({ message: "Product image must be a valid URL." }),
    price: zod_1.z.number().positive({ message: "Price must be a positive number." }),
    stock: zod_1.z
        .number()
        .int()
        .nonnegative({ message: "Stock must be a non-negative integer." }),
});
const orderItemSchema = productSchema.extend({
    quantity: zod_1.z
        .number()
        .int()
        .positive({ message: "Quantity must be a positive integer." }),
});
const userSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, { message: "Username is required." }),
    name: zod_1.z.string().min(1, { message: "User name is required." }),
    email: zod_1.z.string().email({ message: "Email must be a valid email address." }),
    image: zod_1.z.string().url({ message: "User image must be a valid URL." }),
    address: zod_1.z.string().min(1, { message: "Address is required." }),
});
const createOrderSchema = zod_1.z.object({
    subtotal: zod_1.z
        .number()
        .nonnegative({ message: "Subtotal must be a non-negative number." }),
    shippingCost: zod_1.z
        .number()
        .nonnegative({ message: "Shipping cost must be a non-negative number." }),
    tax: zod_1.z
        .number()
        .nonnegative({ message: "Tax must be a non-negative number." }),
    totalPrice: zod_1.z
        .number()
        .nonnegative({ message: "Total price must be a non-negative number." }),
    items: zod_1.z
        .array(orderItemSchema)
        .nonempty({ message: "Order must have at least one item." }),
    user: userSchema,
});
const shippingDetailsSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, { message: "Name is required." })
        .max(100, { message: "Name cannot exceed 100 characters." }),
    email: zod_1.z.string().email({ message: "Invalid email format." }),
    phone: zod_1.z
        .string()
        .min(10, { message: "Phone number must have at least 10 digits." })
        .max(15, { message: "Phone number cannot exceed 15 digits." }),
    address: zod_1.z
        .string()
        .min(1, { message: "Address is required." })
        .max(250, { message: "Address cannot exceed 250 characters." }),
    paymentMethod: zod_1.z
        .string()
        .min(1, { message: "Payment method is required." })
        .max(50, { message: "Payment method cannot exceed 50 characters." }),
});
const confirmOrderSchema = zod_1.z.object({
    shippingDetails: shippingDetailsSchema,
    items: zod_1.z
        .array(orderItemSchema)
        .nonempty({ message: "Order must have at least one item." }),
});
exports.OrderValidations = {
    createOrderSchema,
    confirmOrderSchema,
};
