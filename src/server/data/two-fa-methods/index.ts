"use server";
import { and, eq } from "drizzle-orm";
import {
  TWO_FA_LABELS,
  TWO_FA_TYPE,
  TwoFaType,
  twoFactorDisplay,
  twoFactorMethod,
} from "~/server/db/schemas/users/two-factor-methods";
import { db } from "~/server/db";
import { currentUserCanPerformAction } from "~/server/auth/actions/user";

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
        label: TWO_FA_LABELS[item.twoFaType as keyof typeof TWO_FA_LABELS],
      } as twoFactorDisplay;
    });
    return displayResults;
  } catch (e) {
    return null;
  }
};

export const addEmailTwoFactor = async ({ userID }: { userID: string }) => {
  const hasMethod = await db.query.twoFactorMethod.findFirst({
    where:
      eq(twoFactorMethod.userID, userID) &&
      eq(twoFactorMethod.twoFaType, TWO_FA_TYPE.EMAIL),
  });
  if (!hasMethod) {
    await db.insert(twoFactorMethod).values({
      userID,
      twoFaType: TWO_FA_TYPE.EMAIL,
      status: true,
    });
  }
};

export const addTwoFactorMethod = async ({
  userID,
  data,
  type,
  status = false,
}: {
  userID: string;
  data?: string;
  type: TwoFaType;
  status: boolean;
}) => {
  if (!(await currentUserCanPerformAction(userID))) return;
  const hasMethod = await db.query.twoFactorMethod.findFirst({
    where:
      eq(twoFactorMethod.userID, userID) && eq(twoFactorMethod.twoFaType, type),
  });
  if (!hasMethod) {
    await db.insert(twoFactorMethod).values({
      userID,
      twoFaType: type,
      twoFaData: data,
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
  method: TwoFaType;
  label: string;
  data: string | null;
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
        label: TWO_FA_LABELS[item.twoFaType as keyof typeof TWO_FA_TYPE],
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
  type: TwoFaType;
}): Promise<TwoFactorDetails[] | null> => {
  if (!userID || !(await currentUserCanPerformAction(userID))) return null;

  try {
    const methods = await db.query.twoFactorMethod.findMany({
      where: and(
        eq(twoFactorMethod.userID, userID),
        eq(twoFactorMethod.twoFaType, type),
      ),
    });

    const displayResults = methods.map((item) => {
      return {
        method: item.twoFaType,
        label: TWO_FA_LABELS[item.twoFaType as keyof typeof TWO_FA_LABELS],
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
