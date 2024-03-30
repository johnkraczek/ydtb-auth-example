import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.string().optional(),
  method: z.string().optional(),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  fullName: z.string().min(1, {
    message: "Name is required",
  }),
});

export const PasswordResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const PasswordVerifySchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters is required",
  }),
});

export const TwoFaCodeSchema = z.object({
  code: z.string().length(6, {
    message: "Code must be 6 numbers."
  })
})