import { z } from "zod";
import { CategoryValidations } from "../category/category.validation";

const createProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required." }),
  description: z
    .string()
    .min(1, { message: "Product description is required." }),
  images: z.array(z.string().url()).optional(),
  price: z.number().positive({ message: "Price must be a positive number." }),
  stock: z
    .number()
    .int()
    .nonnegative({ message: "Stock must be a non-negative integer." }),
  categories: z.array(CategoryValidations.createCategorySchema),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const updateProductSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    images: z.array(z.string().url()).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    categories: z.array(CategoryValidations.createCategorySchema).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .partial();

export const ProductValidations = {
  createProductSchema,
  updateProductSchema,
};
