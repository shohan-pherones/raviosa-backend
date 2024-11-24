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
    image: zod_1.z.string().url({ message: "Invalid image url." }),
    price: zod_1.z.number().positive({ message: "Price must be a positive number." }),
    stock: zod_1.z
        .number()
        .int()
        .nonnegative({ message: "Stock must be a non-negative integer." }),
    categories: zod_1.z.array(zod_1.z.string().refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), {
        message: "Invalid category ID format",
    })),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
const updateProductSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().min(1).optional(),
    image: zod_1.z.string().url().optional(),
    price: zod_1.z.number().positive().optional(),
    stock: zod_1.z.number().int().nonnegative().optional(),
    categories: zod_1.z.array(zod_1.z.string().refine((id) => mongoose_1.default.Types.ObjectId.isValid(id), {
        message: "Invalid category ID format",
    })),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
})
    .partial();
exports.ProductValidations = {
    createProductSchema,
    updateProductSchema,
};
