"use server";
import { z } from "zod";
import { Result } from "~/types/result";
import { LoginSchema } from "~/validation/auth";

export const loginAction = async (
  values: z.infer<typeof LoginSchema>,
): Promise<Result> => {
  return {
    success: true,
    message: "ABC",
  };
};
