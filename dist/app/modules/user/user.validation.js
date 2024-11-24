"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3)
        .max(30)
        .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username should only contain letters, numbers, and underscores.",
    }),
    name: zod_1.z.string().min(1, { message: "Name is required." }),
    email: zod_1.z.string().email({ message: "Invalid email format." }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
    })
        .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
    })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[@$!%*?&]/, {
        message: "Password must contain at least one special character (@$!%*?&).",
    }),
    image: zod_1.z.string().url({ message: "Invalid image URL format." }),
    address: zod_1.z
        .string()
        .min(5, { message: "Address must be at least 5 characters long." }),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email format." }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
    })
        .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
    })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[@$!%*?&]/, {
        message: "Password must contain at least one special character (@$!%*?&).",
    }),
});
const refreshTokenSchema = zod_1.z.string();
const updateUserSchema = zod_1.z
    .object({
    username: zod_1.z
        .string()
        .min(3)
        .max(30)
        .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username should only contain letters, numbers, and underscores.",
    }),
    name: zod_1.z.string().min(1, { message: "Name is required." }),
    image: zod_1.z.string().url({ message: "Invalid image URL format." }),
    address: zod_1.z
        .string()
        .min(5, { message: "Address must be at least 5 characters long." }),
})
    .partial();
exports.UserValidations = {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    updateUserSchema,
};
