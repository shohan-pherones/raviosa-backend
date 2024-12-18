"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidations = exports.updateProductSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Product name is required." }),
    description: zod_1.z
        .string()
        .min(1, { message: "Product description is required." }),
    price: zod_1.z
        .string()
        .refine((val) => !isNaN(parseFloat(val)), {
        message: "Price must be a valid number.",
    })
        .transform((val) => parseFloat(val))
        .refine((val) => val > 0, { message: "Price must be a positive number." }),
    stock: zod_1.z
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
    categories: zod_1.z.array(zod_1.z.string().refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), {
        message: "Invalid category ID format",
    })),
    image: zod_1.z
        .any()
        .refine((file) => file instanceof File, {
        message: "Image must be a file.",
    })
        .optional(),
});
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Product name is required." }),
    description: zod_1.z
        .string()
        .min(1, { message: "Product description is required." }),
    price: zod_1.z.number().positive({ message: "Price must be a positive number." }),
    stock: zod_1.z
        .number()
        .int({ message: "Stock must be an integer." })
        .nonnegative({ message: "Stock must be a non-negative integer." }),
});
exports.ProductValidations = {
    createProductSchema,
    updateProductSchema: exports.updateProductSchema,
};
