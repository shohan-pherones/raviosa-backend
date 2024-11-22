import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, { message: "Product name is required." }),
  description: z
    .string()
    .min(1, { message: "Product description is required." }),
  image: z.string().url({ message: "Product image must be a valid URL." }),
  price: z.number().positive({ message: "Price must be a positive number." }),
  stock: z
    .number()
    .int()
    .nonnegative({ message: "Stock must be a non-negative integer." }),
});

const orderItemSchema = productSchema.extend({
  quantity: z
    .number()
    .int()
    .positive({ message: "Quantity must be a positive integer." }),
});

const userSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  name: z.string().min(1, { message: "User name is required." }),
  email: z.string().email({ message: "Email must be a valid email address." }),
  image: z.string().url({ message: "User image must be a valid URL." }),
  address: z.string().min(1, { message: "Address is required." }),
});

export const createOrderSchema = z.object({
  subtotal: z
    .number()
    .nonnegative({ message: "Subtotal must be a non-negative number." }),
  shippingCost: z
    .number()
    .nonnegative({ message: "Shipping cost must be a non-negative number." }),
  tax: z
    .number()
    .nonnegative({ message: "Tax must be a non-negative number." }),
  totalPrice: z
    .number()
    .nonnegative({ message: "Total price must be a non-negative number." }),
  items: z
    .array(orderItemSchema)
    .nonempty({ message: "Order must have at least one item." }),
  user: userSchema,
});

export const OrderValidations = {
  createOrderSchema,
};
