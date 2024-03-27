import { generateToken } from "~/server/data/tokens/token";
import { TokenType } from "~/server/db/schemas/users/user-token";
import { sendVerificationEmail } from "~/server/mail/actions/emails";

export const getEmailVerified = async (email: string) => {
  const verificationToken = await generateToken(
    email,
    TokenType.VERIFY_EMAIL_TOKEN,
  );
  const sent = await sendVerificationEmail({
    email,
    validationCode: verificationToken,
  });
  if (sent.err) {
    return {
      success: false,
      message: "Error sending email",
    };
  }
  return { success: true, message: "Confirmation Email Sent!" };
};
