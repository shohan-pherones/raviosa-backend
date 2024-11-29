import mongoose from "mongoose";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required." }),
  description: z
    .string()
    .min(1, { message: "Product description is required." }),
  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Price must be a valid number.",
    })
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, { message: "Price must be a positive number." }),
  stock: z
    .string()
    .refine((val) => !isNaN(parseInt(val, 10)), {
      message: "Stock must be a valid number.",
    })
    .transform((val) => parseInt(val, 10))
    .refine((val) => Number.isInteger(val), {
      message: "Stock must be an integer.",
    })
    .refine((val) => val >= 0, {
      message: "Stock must be a non-negative integer.",
    }),
  categories: z.array(
    z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "Invalid category ID format",
    })
  ),
  image: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Image must be a file.",
    })
    .optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required." }),
  description: z
    .string()
    .min(1, { message: "Product description is required." }),
  price: z.number().positive({ message: "Price must be a positive number." }),
  stock: z
    .number()
    .int({ message: "Stock must be an integer." })
    .nonnegative({ message: "Stock must be a non-negative integer." }),
});

export const ProductValidations = {
  createProductSchema,
  updateProductSchema,
};
