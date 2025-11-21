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
}) .superRefine((data, ctx) => 
  {
    if (!data.newPassword || !data.confirmPassword) 
    {
      return;
    }

    if (data.newPassword !== data.confirmPassword)
    {
      ctx.addIssue({
        code: "custom",
        message: "unmatchPassword",
        path: ["confirmPassword"],
      });
    }
  });