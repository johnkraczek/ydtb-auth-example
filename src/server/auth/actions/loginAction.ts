"use server";
import { z } from "zod";
import { getUserByEmail, verifyUserCredentials } from "~/server/data/user";
import { LoginSchema } from "~/validation/auth";
import { signIn } from "~/server/auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { getEmailVerified } from "./login-flow/send-email-verification";
import {
  generateConfirmationToken,
  getVerifiedConfirmationToken,
} from "./two-fa/twoFactor";
import { getTwoFactorDisplayMethodsByUser } from "~/server/data/two-fa-methods";
import { twoFactorDisplay } from "~/server/db/schemas/users/two-factor-methods";
import { TokenType } from "~/server/db/schemas/users/user-token";
import { generateToken, validateToken } from "~/server/data/tokens/token";
import { sendTwoFactorConfEmail } from "~/server/mail/actions/emails";

type successResult = {
  success: true;
  message: string;
};

type success2FAChoice = {
  success: "2FA-Choice";
  options: twoFactorDisplay[];
};
type success2FAConfirm = {
  success: "2FA-Confirm";
  message: string;
};
type fail2FAConfirm = {
  success: "2FA-Conf-Fail";
  message: string;
};

type errorResult<E = Error> = {
  success: false;
  message: string;
  error?: E;
};

type Result<E = Error> =
  | successResult
  | errorResult<E>
  | success2FAChoice
  | success2FAConfirm
  | fail2FAConfirm;

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
  const { email, password, code, method } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email)
    return {
      success: false,
      message: "Invalid Login",
    };

  // send email verification
  if (!existingUser.emailVerified) return await getEmailVerified(email);

  if (existingUser.isTwoFactorEnabled) {
    // check if the user has provided correct login information, but dont actually log them in yet.
    const goodCredentials = await verifyUserCredentials(email, password);
    // TODO this is a good place to do some rate limiting so that someone cant brute force the regular password.
    if (!goodCredentials) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    const twoFaConfirmation = await getVerifiedConfirmationToken(
      existingUser.email,
    );

    if (!twoFaConfirmation) {
      if (method === undefined) {
        const methods = await getTwoFactorDisplayMethodsByUser(existingUser.id);
        if (!methods) {
          return {
            success: false,
            message: "No Available 2FA Methods",
          };
        }
        return {
          success: "2FA-Choice",
          options: methods,
        };
      }
      if (!code) {
        // handle sending the code via the chosen method
        let newToken;
        if (method === "sms") {
          newToken = await generateToken(
            existingUser.email,
            TokenType.TWOFA_SMS_TOKEN,
          );
          // @TODO add SMS provider
        }
        if (method === "email") {
          newToken = await generateToken(
            existingUser.email,
            TokenType.TWOFA_EMAIL_TOKEN,
          );
          sendTwoFactorConfEmail({
            email: existingUser.email,
            validationCode: newToken,
          });
        }
        if (method === "authenticator") {
          //@TODO Add Authenticator 2fa type
        }

        return {
          success: "2FA-Confirm",
          message:
            (method == "sms" || "email"
              ? "Code Sent Via: "
              : "Get code from: ") + method,
        };
      }

      if (code) {
        if (method === "sms" || "email") {
          const type =
            method == "email"
              ? TokenType.TWOFA_EMAIL_TOKEN
              : TokenType.TWOFA_SMS_TOKEN;
          const tokenIsValid = await validateToken(
            existingUser.email,
            code,
            type,
          );
          if (!tokenIsValid) {
            return {
              success: "2FA-Conf-Fail",
              message: "Invalid 2FA Code",
            };
          }
          // push confirmation jwt into the users httpOnly cookie as confirmation they successfully completed a 2FA method
          generateConfirmationToken(existingUser.email);
          // if you want them to not be asked to do the 2FA again so soon you can increase the number here in seconds.
          // generateConfirmationToken(existingUser.email, 600);
        }

        if (method === "authenticator") {
          //@TODO verify the authenticator method
        }
      }
    }
  }

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
