import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()  
    .min(1, { message: "required" })
    .email({ message: "invalidEmail" }),

  password: z
    .string()
    .min(1, { message: "required" }),

  server: z.string().optional(),
});
