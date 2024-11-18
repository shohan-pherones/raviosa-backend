import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "Username should only contain letters, numbers, and underscores.",
    }),
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email format." }),
  password: z
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
      message:
        "Password must contain at least one special character (@$!%*?&).",
    }),
  image: z.string().url({ message: "Invalid image URL format." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long." }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  password: z
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
      message:
        "Password must contain at least one special character (@$!%*?&).",
    }),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

const updateUserSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          "Username should only contain letters, numbers, and underscores.",
      }),
    name: z.string().min(1, { message: "Name is required." }),
    image: z.string().url({ message: "Invalid image URL format." }),
    address: z
      .string()
      .min(5, { message: "Address must be at least 5 characters long." }),
  })
  .partial();

export const UserValidations = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateUserSchema,
};
