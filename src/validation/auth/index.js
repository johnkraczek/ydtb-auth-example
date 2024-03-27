import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
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