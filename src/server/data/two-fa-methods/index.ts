"use server";
import { eq } from "drizzle-orm";
import {
  twoFaMethod,
  twoFactorDisplay,
  twoFactorMethod,
} from "~/server/db/schemas/users/two-factor-methods";
import { db } from "~/server/db";
import { currentUserCanPerformAction } from "~/server/auth/actions/user";

const twoFaLabels = {
  email: "Email a code",
  sms: "Get a Text Message",
  authenticator: "Use an Authenticator App",
};

export const getTwoFactorDisplayMethodsByUser = async (
  userID: string,
): Promise<twoFactorDisplay[] | null> => {
  try {
    const methods = await db.query.twoFactorMethod.findMany({
      where: eq(twoFactorMethod.userID, userID),
    });

    const displayResults = methods.map((item) => {
      return {
        method: item.twoFaType,
        label: twoFaLabels[item.twoFaType as keyof typeof twoFaLabels],
      } as twoFactorDisplay;
    });
    return displayResults;
  } catch (e) {
    return null;
  }
};

export const addEmailTwoFactor = async ({ userID }: { userID: string }) => {
  const config: twoFaMethod = { method: "email" };
  const hasMethod = await db.query.twoFactorMethod.findFirst({
    where:
      eq(twoFactorMethod.userID, userID) &&
      eq(twoFactorMethod.twoFaType, config.method),
  });
  if (!hasMethod) {
    await db.insert(twoFactorMethod).values({
      userID,
      twoFaType: config.method,
      twoFaData: config,
    });
  }
};

export const addTwoFactorMethod = async ({
  userID,
  config,
}: {
  userID: string;
  config: twoFaMethod;
}) => {
  if (!(await currentUserCanPerformAction(userID))) return;
  const hasMethod = await db.query.twoFactorMethod.findFirst({
    where:
      eq(twoFactorMethod.userID, userID) &&
      eq(twoFactorMethod.twoFaType, config.method),
  });
  if (!hasMethod) {
    await db.insert(twoFactorMethod).values({
      userID,
      twoFaType: config.method,
      twoFaData: config,
    });
  }
};

export const removeTwoFactorMethod = async (
  userID: string,
  methodID: string,
) => {
  if (!(await currentUserCanPerformAction(userID))) return;
  await db
    .delete(twoFactorMethod)
    .where(
      eq(twoFactorMethod.id, methodID) && eq(twoFactorMethod.userID, userID),
    );
};
