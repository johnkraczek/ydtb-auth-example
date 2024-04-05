"use server";

import { TWO_FA_TYPE } from "~/server/db/schemas/users/two-factor-methods";
import { getSVG } from "qreator/lib/svg";
import { currentUser } from "../user";
import {
  addTwoFactorMethod,
  getTwoFactorDataByType,
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
    type: TWO_FA_TYPE.AUTHENTICATOR,
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
    data: secret.ascii,
    type: TWO_FA_TYPE.AUTHENTICATOR,
    status: false,
  });

  return getSVG(secret.otpauth_url!, {
    color: "#000000",
    bgColor: "#FFFFFF",
  });
};

// first time auth code validation
export const validateFirstAuthCode = async (
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
  if (!user) {
    return {
      success: false,
      message: "Invalid Login To Link",
    };
  }

  const existingAuthArray = await getTwoFactorMethodDetailsByType({
    userID: user.id!,
    type: TWO_FA_TYPE.AUTHENTICATOR,
  });

  if (existingAuthArray?.length != 1 || existingAuthArray[0]!.status != false) {
    return {
      success: false,
      message: "Invalid 2FA User Data Saved",
    };
  }
  const methodData = existingAuthArray[0];
  const authSecret = methodData?.data;

  if (!authSecret) {
    return {
      success: false,
      message: "Invalid 2FA Secret Previously Saved",
    };
  }

  let tokenValidates = speakeasy.totp.verify({
    secret: authSecret,
    token: validatedCode.data.code,
    window: 2,
  });

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

export const confirmValidAuthCode = async ({
  code,
  userID,
}: {
  code: string;
  userID: string;
}): Promise<Result> => {
  const methodData = await getTwoFactorDataByType({
    userID: userID!,
    type: TWO_FA_TYPE.AUTHENTICATOR,
  });

  if (!methodData || methodData.data == null) {
    return {
      success: false,
      message: "Invalid 2FA Secret Previously Saved",
    };
  }

  let tokenValidates = speakeasy.totp.verify({
    secret: methodData.data,
    token: code,
    window: 2,
  });

  if (tokenValidates) {
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
