"use server";

import { getTokenByToken, removeTokenByID } from "~/server/data/tokens/token";
import { getUserByEmail, updateUserPass } from "~/server/data/user";
import { TokenType } from "~/server/db/schemas/users/user-token";
import { Result } from "~/types/result";
import { PasswordVerifySchema } from "~/validation/auth";

export const newPaswordAction = async ({
  values,
  token,
}: {
  values: { password: string };
  token: string | null;
}): Promise<Result> => {
  if (!token) {
    return {
      success: false,
      message: "Token is required",
    };
  }

  const validatedPassword = PasswordVerifySchema.safeParse(values);

  if (!validatedPassword.success) {
    return {
      success: false,
      message: "Invalid password",
    };
  }

  const { password } = validatedPassword.data;

  const existingToken = await getTokenByToken(
    token,
    TokenType.PASS_RESET_TOKEN,
  );

  if (!existingToken) {
    return {
      success: false,
      message: "Invalid token",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      success: false,
      message: "User not found",
    };
  }

  await updateUserPass(existingUser.id, password);
  await removeTokenByID(existingToken.id, TokenType.PASS_RESET_TOKEN);

  return {
    success: true,
    message: "Password updated successfully",
  };
};
