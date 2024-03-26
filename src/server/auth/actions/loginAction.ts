"use server";
import { z } from "zod";
import { isUserEmailVerified, userExistsByEmail } from "~/server/data/user";
import { Result } from "~/types/result";
import { LoginSchema } from "~/validation/auth";
import { signIn } from "~/server/auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { getVerifiedEmail } from "./login-flow/send-email-verification";

export const loginAction = async (
  values: z.infer<typeof LoginSchema>,
): Promise<Result> => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid fields",
    };
  }

  const { email, password } = validatedFields.data;

  const userExists = await userExistsByEmail(email, true);
  if (!userExists)
    return {
      success: false,
      message: "Invalid Login",
    };

  // send email verification
  if (!(await isUserEmailVerified(email))) return await getVerifiedEmail(email);

  // check for 2fa

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return {
      success: true,
      message: "",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid credentials",
          };
        default:
          return {
            success: false,
            message: "An unknown error occurred",
          };
      }
    }
    throw error;
  }
};
