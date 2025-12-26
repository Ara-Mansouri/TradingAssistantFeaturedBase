import { z } from "zod";

export const forgetpasswordSchema = z.object({
  email: z
    .string()
     .trim()  
    .min(1, { message: "required" })
    .email({ message: "invalidEmail" }),

  server: z.string().optional(),
});
