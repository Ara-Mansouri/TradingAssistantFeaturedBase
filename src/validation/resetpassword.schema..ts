import { z } from "zod";

export const resetpasswordSchema = z.object({
  code: z
    .string()
    .min(1, { message: "required" }),
    
  newPassword: z
    .string()
    .min(1, { message: "required" }),

  confirmPassword: z
    .string()
    .min(1, { message: "required" }),

  server: z.string().optional(),
}) .refine((data) => data.newPassword === data.confirmPassword,
   {
    message: "unmatchPassword",
    path: ["confirmPassword"], 
  });;
