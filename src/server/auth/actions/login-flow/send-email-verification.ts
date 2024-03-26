import { generateVerificationToken } from "~/server/data/tokens/verification-token";
import { sendVerificationEmail } from "~/server/mail/services/auth";

export const getVerifiedEmail = async (email: string) => {
  const verificationToken = await generateVerificationToken(email);
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
