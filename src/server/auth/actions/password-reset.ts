"use server";
import { z } from "zod";
import { generateToken } from "~/server/data/tokens/token";
import { userExistsByEmail } from "~/server/data/user";
import { TokenType } from "~/server/db/schemas/users/user-token";
import { sendPasswordResetEmail } from "~/server/mail/actions/emails";
import { Result } from "~/types/result";
import { PasswordResetSchema } from "~/validation/auth";

export const passwordResetAction = async (
  values: z.infer<typeof PasswordResetSchema>,
): Promise<Result> => {
  const validatedFields = PasswordResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid fields",
    };
  }

  const { email } = validatedFields.data;

  if (!(await userExistsByEmail(email))) {
    return {
      success: false,
      message: "Email not found.",
    };
  }

  const token = await generateToken(email, TokenType.PASS_RESET_TOKEN);

  const resetResults = await sendPasswordResetEmail({
    email,
    validationCode: token,
  });

  if (resetResults.err) {
    return {
      success: false,
      message: "Error sending email",
    };
  }

  return {
    success: true,
    message: "Password reset email sent!",
  };
};
