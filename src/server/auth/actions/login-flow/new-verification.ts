"use server";

import { getTokenByToken, removeTokenByID } from "~/server/data/tokens/token";
import { VerifyUserEmail, userExistsByEmail } from "~/server/data/user";
import { TokenType } from "~/server/db/schemas/users/user-token";
import { Result } from "~/types/result";

export const newEmailVerification = async (
  token: string,
  email: string,
): Promise<Result> => {
  const existingToken = await getTokenByToken(
    token,
    TokenType.VERIFY_EMAIL_TOKEN,
  );
  if (!existingToken) {
    return {
      success: false,
      message: "Invalid or expired token",
    };
  }

  const user = await userExistsByEmail(existingToken.email);
  if (!user) {
    return {
      success: false,
      message: "Email not found",
    };
  }

  await VerifyUserEmail(existingToken.email);
  await removeTokenByID(token, TokenType.VERIFY_EMAIL_TOKEN);

  return {
    success: true,
    message: "Email verified",
  };
};
