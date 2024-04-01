"use server";

import {
  TwoFaType,
  authenticatorMethod,
} from "~/server/db/schemas/users/two-factor-methods";
import { getSVG } from "qreator/lib/svg";
import { currentUser } from "../user";
import {
  addTwoFactorMethod,
  getTwoFactorMethodDetailsByType,
  removeTwoFactorMethod,
  setMethodStatus,
} from "~/server/data/two-fa-methods";

import speakeasy from "@levminer/speakeasy";
import { Result } from "~/types/result";
import { TwoFaCodeSchema } from "~/validation/auth";
import { z } from "zod";

export const getAuthenticatorQr = async () => {
  const user = await currentUser();

  if (!user) return null;

  // check if we already have a previous un-verified authenticator account. If so delete it.

  const existingAuthArray = await getTwoFactorMethodDetailsByType({
    userID: user.id!,
    type: "AUTHENTICATOR",
  });

  if (!existingAuthArray) return null;

  if (existingAuthArray.length > 0) {
    // check if it's active
    const existingAuth = existingAuthArray[0];
    if (existingAuth?.status) {
      // the status was confirmed on an existing token.
      throw new Error("Existing confirmed token. ");
    }

    await removeTwoFactorMethod(user.id!, existingAuth?.id!);
  }

  const secret = speakeasy.generateSecret({
    name: "YDTB Auth Example",
  });
  await addTwoFactorMethod({
    userID: user.id!,
    config: {
      method: "AUTHENTICATOR",
      secret: secret.ascii,
    },
    status: false,
  });

  return getSVG(secret.otpauth_url!, {
    color: "#000000",
    bgColor: "#FFFFFF",
  });
};

export const validateAuthCode = async (
  values: z.infer<typeof TwoFaCodeSchema>,
): Promise<Result> => {
  const validatedCode = TwoFaCodeSchema.safeParse(values);

  if (!validatedCode.success) {
    return {
      success: false,
      message: "Invalid fields",
    };
  }

  const user = await currentUser();
  if (!user)
    return {
      success: false,
      message: "Invalid Login To Link",
    };

  const existingAuthArray = await getTwoFactorMethodDetailsByType({
    userID: user.id!,
    type: "AUTHENTICATOR",
  });

  console.log(existingAuthArray);

  if (existingAuthArray?.length != 1 || existingAuthArray[0]!.status != false) {
    return {
      success: false,
      message: "Invalid 2FA User Data Saved",
    };
  }
  const methodData = existingAuthArray[0];

  const authSecret = methodData?.data as authenticatorMethod;

  console.log("secret", authSecret.secret);

  let tokenValidates = speakeasy.totp.verify({
    secret: authSecret?.secret,
    token: validatedCode.data.code,
    window: 10,
  });

  console.log("tokenValid: ", tokenValidates);

  if (tokenValidates) {
    await setMethodStatus({
      userID: user.id!,
      methodID: methodData!.id,
      status: true,
    });
    return {
      success: true,
      message: "Auth Linked Successfully",
    };
  }

  return {
    success: false,
    message: "Something went wrong.",
  };
};
