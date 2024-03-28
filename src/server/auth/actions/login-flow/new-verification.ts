"use server";

import { getTokenByToken, removeTokenByID } from "~/server/data/tokens/token";
import { addEmailTwoFactor } from "~/server/data/two-fa-methods";
import { setUserEmailAsVerified, getUserByEmail } from "~/server/data/user";
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

  const user = await getUserByEmail(existingToken.email);
  if (!user) {
    return {
      success: false,
      message: "Email not found",
    };
  }

  await setUserEmailAsVerified(existingToken.email);
  await addEmailTwoFactor({ userID: user.id });
  await removeTokenByID(existingToken.id, TokenType.VERIFY_EMAIL_TOKEN);

  return {
    success: true,
    message: "Email verified",
  };
};
