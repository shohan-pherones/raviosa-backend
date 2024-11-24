"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidations = void 0;
const zod_1 = require("zod");
const createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Category name is required." }),
});
exports.CategoryValidations = {
    createCategorySchema,
};
