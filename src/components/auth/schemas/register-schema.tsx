import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({
      message: "Please enter a valid email address.",
    })
    .min(1, "Please enter a valid email address.")
    .max(50)
    .regex(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please enter a valid email address."
    ),
  username: z
    .string({
      message: "Please enter a valid username.",
    })
    .min(1, "Please enter a valid username.")
    .max(50),
  firstname: z
    .string({
      message: "Please enter your first name.",
    })
    .min(1, "First name is required.")
    .max(50, "First name must be less than 50 characters."),
  lastname: z
    .string({
      message: "Please enter your last name.",
    })
    .min(1, "Last name is required.")
    .max(50, "Last name must be less than 50 characters."),
  password: z
    .string({
      message: "Please enter a valid password.",
    })
    .min(8)
    .max(50)
    .regex(
        /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters long, include one uppercase letter, and one number"
      ),
  confirmPassword: z
    .string({
      message: "Please confirm your password.",
    })
    .min(1, "Please confirm your password."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export type RegisterSchema = z.infer<typeof registerSchema>;