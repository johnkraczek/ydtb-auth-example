"use server";

import { z } from "zod";
import { Result } from "~/types/result";
import { RegisterSchema } from "~/validation/auth";

import { createUser, userExistsByEmail } from "~/server/data/user";
import { getVerifiedEmail } from "./login-flow/send-email-verification";

export const RegisterAction = async (
  values: z.infer<typeof RegisterSchema>,
): Promise<Result> => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid fields",
    };
  }

  const { email, password, fullName } = validatedFields.data;

  const exists = await userExistsByEmail(email);
  if (exists) {
    return {
      success: false,
      message: "Email already in use",
    };
  }

  await createUser({
    name: fullName,
    email,
    password,
  });

  return getVerifiedEmail(email);
};
