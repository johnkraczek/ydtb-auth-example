"use server";
import { and, eq } from "drizzle-orm";
import {
  TwoFaType,
  twoFaMethod,
  twoFactorDisplay,
  twoFactorMethod,
} from "~/server/db/schemas/users/two-factor-methods";
import { db } from "~/server/db";
import {
  currentUser,
  currentUserCanPerformAction,
} from "~/server/auth/actions/user";

const twoFaLabels = {
  EMAIL: "Email a code",
  SMS: "Get a Text Message",
  AUTHENTICATOR: "Use an Authenticator App",
};

export const getTwoFactorDisplayMethodsByUser = async (
  userID: string,
): Promise<twoFactorDisplay[] | null> => {
  try {
    const methods = await db.query.twoFactorMethod.findMany({
      where: and(
        eq(twoFactorMethod.userID, userID),
        eq(twoFactorMethod.status, true),
      ),
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
  const config: twoFaMethod = { method: "EMAIL" };
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
      status: true,
    });
  }
};

export const addTwoFactorMethod = async ({
  userID,
  config,
  status = false,
}: {
  userID: string;
  config: twoFaMethod;
  status: boolean;
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
      status: status,
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

export type TwoFactorDetails = {
  method: string;
  label: string;
  data: twoFaMethod | null;
  id: string;
  status: boolean;
};

export const getTwoFactorMethodDetailsByUser = async ({
  userID,
}: {
  userID?: string;
}): Promise<TwoFactorDetails[] | null> => {
  if (!userID || !(await currentUserCanPerformAction(userID))) return null;
  try {
    const methods = await db.query.twoFactorMethod.findMany({
      where: and(
        eq(twoFactorMethod.userID, userID),
        eq(twoFactorMethod.status, true),
      ),
    });

    const displayResults = methods.map((item) => {
      return {
        method: item.twoFaType,
        label: twoFaLabels[item.twoFaType as keyof typeof twoFaLabels],
        data: item.twoFaData,
        id: item.id,
        status: item.status,
      };
    });
    return displayResults;
  } catch (e) {
    return null;
  }
};

export const getTwoFactorMethodDetailsByType = async ({
  userID,
  type,
}: {
  userID: string;
  type: string;
}): Promise<TwoFactorDetails[] | null> => {
  if (!userID || !(await currentUserCanPerformAction(userID))) return null;

  console.log("UserID: ", userID);
  console.log("Type: ", type);
  try {
    const methods = await db.query.twoFactorMethod.findMany({
      where: and(
        eq(twoFactorMethod.userID, userID),
        eq(twoFactorMethod.twoFaType, type),
      ),
    });

    console.log("methods", methods);

    const displayResults = methods.map((item) => {
      return {
        method: item.twoFaType,
        label: twoFaLabels[item.twoFaType as keyof typeof twoFaLabels],
        data: item.twoFaData,
        id: item.id,
        status: item.status,
      };
    });
    return displayResults;
  } catch (e) {
    return null;
  }
};

export const setMethodStatus = async ({
  userID,
  methodID,
  status,
}: {
  userID: string;
  methodID: string;
  status: boolean;
}) => {
  if (!userID || !(await currentUserCanPerformAction(userID))) return null;

  await db
    .update(twoFactorMethod)
    .set({ status: status })
    .where(
      and(eq(twoFactorMethod.userID, userID), eq(twoFactorMethod.id, methodID)),
    );
};
