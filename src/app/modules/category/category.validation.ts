import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required." }),
});

export const CategoryValidations = {
  createCategorySchema,
};
