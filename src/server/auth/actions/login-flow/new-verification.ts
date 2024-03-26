"use server";

import {
  getVerificationTokenByToken,
  removeVerificationToken,
} from "~/server/data/tokens/verification-token";
import { VerifyUserEmail, userExistsByEmail } from "~/server/data/user";
import { Result } from "~/types/result";

export const newVerification = async (token: string): Promise<Result> => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return {
      success: false,
      message: "Invalid token",
    };
  }

  if (existingToken.expires < new Date()) {
    return {
      success: false,
      message: "Token expired",
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
  await removeVerificationToken(token);

  return {
    success: true,
    message: "Email verified",
  };
};
