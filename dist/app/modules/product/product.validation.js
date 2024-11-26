"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidations = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Product name is required." }),
    description: zod_1.z
        .string()
        .min(1, { message: "Product description is required." }),
    image: zod_1.z.unknown().transform((value) => {
        return value;
    }),
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
});
const updateProductSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .min(1, { message: "Product name is required." })
        .optional(),
    description: zod_1.z
        .string()
        .min(1, { message: "Product description is required." })
        .optional(),
    image: zod_1.z
        .unknown()
        .transform((value) => {
        return value;
    })
        .optional(),
    price: zod_1.z
        .string()
        .refine((val) => !isNaN(parseFloat(val)), {
        message: "Price must be a valid number.",
    })
        .transform((val) => parseFloat(val))
        .refine((val) => val > 0, {
        message: "Price must be a positive number.",
    })
        .optional(),
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
    })
        .optional(),
    categories: zod_1.z
        .array(zod_1.z.string().refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), {
        message: "Invalid category ID format",
    }))
        .optional(),
})
    .partial();
exports.ProductValidations = {
    createProductSchema,
    updateProductSchema,
};
