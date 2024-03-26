"use server";

import { z } from "zod";
import { Result } from "~/types/result";
import { RegisterSchema } from "~/validation/auth";

export const RegisterAction = async (
  values: z.infer<typeof RegisterSchema>,
): Promise<Result> => {
  return {
    success: true,
    message: "ABC",
  };
};
