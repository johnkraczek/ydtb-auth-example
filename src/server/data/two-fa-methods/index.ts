"use server";
import { and, eq } from "drizzle-orm";
import {
  TWO_FA_DISPLAY,
  TWO_FA_LABELS,
  TWO_FA_TYPE,
  TwoFaType,
  twoFactorDisplay,
  twoFactorMethod,
} from "~/server/db/schemas/users/two-factor-methods";
import { db } from "~/server/db";
import {
  currentUser,
  currentUserCanPerformAction,
} from "~/server/auth/actions/user";
import { UserRole } from "~/server/db/schemas/users/user-account";
import { Result } from "~/types/result";

export type TwoFactorDetails = {
  method: TwoFaType;
  label: string;
  display: string;
  id: string;
  status: boolean;
  data: string | undefined;
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
    where: and(
      eq(twoFactorMethod.userID, userID),
      eq(twoFactorMethod.twoFaType, TWO_FA_TYPE.EMAIL),
    ),
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
    where: and(
      eq(twoFactorMethod.userID, userID),
      eq(twoFactorMethod.twoFaType, type),
    ),
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
  userID?: string,
  methodID?: string,
) => {
  if (!userID || !methodID || !(await currentUserCanPerformAction(userID)))
    return;

  console.log("Deleting Method: ", methodID);

  await db
    .delete(twoFactorMethod)
    .where(
      and(eq(twoFactorMethod.id, methodID), eq(twoFactorMethod.userID, userID)),
    );
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
        display: TWO_FA_DISPLAY[item.twoFaType as keyof typeof TWO_FA_TYPE],
        id: item.id,
        status: item.status,
        data: undefined,
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
        label: TWO_FA_LABELS[item.twoFaType as keyof typeof TWO_FA_TYPE],
        display: TWO_FA_DISPLAY[item.twoFaType as keyof typeof TWO_FA_TYPE],
        id: item.id,
        status: item.status,
        data: item.twoFaData || undefined,
      };
    });
    return displayResults;
  } catch (e) {
    return null;
  }
};

export const getTwoFactorDataByID = async ({
  userID,
  methodID,
}: {
  userID: string;
  methodID: string;
}): Promise<TwoFactorDetails | null> => {
  if (!userID || !(await currentUserCanPerformAction(userID))) return null;
  try {
    const method = await db.query.twoFactorMethod.findFirst({
      where: and(
        eq(twoFactorMethod.userID, userID),
        eq(twoFactorMethod.id, methodID),
      ),
    });

    if (!method) return null;

    return {
      method: method.twoFaType,
      label: TWO_FA_LABELS[method.twoFaType as keyof typeof TWO_FA_TYPE],
      display: TWO_FA_DISPLAY[method.twoFaType as keyof typeof TWO_FA_TYPE],
      id: method.id,
      status: method.status,
      data: method.twoFaData || undefined,
    };
  } catch (e) {
    return null;
  }
};

export const userHasTwoFactorType = async ({ type }: { type: TwoFaType }) => {
  const user = await currentUser();
  if (!user) return false;
  const methodQuery = await db.query.twoFactorMethod.findFirst({
    where: and(
      eq(twoFactorMethod.userID, user.id!),
      eq(twoFactorMethod.twoFaType, type),
    ),
  });

  if (!methodQuery || !methodQuery.status) return false;
  return methodQuery.id;
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

export const removeTwoFactorMethodByID = async ({
  methodID,
}: {
  methodID: string;
}): Promise<Result> => {
  const user = await currentUser();
  if (!user)
    return {
      success: false,
      message: "No User",
    };

  const methodQuery = await db.query.twoFactorMethod.findFirst({
    where: and(
      eq(twoFactorMethod.userID, user.id!),
      eq(twoFactorMethod.id, methodID),
    ),
  });

  if (!methodQuery)
    return {
      success: false,
      message: "no current method",
    };

  if (methodQuery.userID != user.id! && !user.roles.includes(UserRole.ADMIN))
    return {
      success: false,
      message: "Bad Permissions",
    };

  await db
    .delete(twoFactorMethod)
    .where(
      and(
        eq(twoFactorMethod.id, methodID),
        eq(twoFactorMethod.userID, user.id!),
      ),
    );

  return {
    success: true,
    message: "Removed 2FA Method",
  };
};

export const getTwoFactorDataByType = async ({
  userID,
  type,
}: {
  userID: string;
  type: TwoFaType;
}) => {
  try {
    const method = await db.query.twoFactorMethod.findFirst({
      where: and(
        eq(twoFactorMethod.userID, userID),
        eq(twoFactorMethod.twoFaType, type),
      ),
    });

    if (!method) return;

    return {
      data: method.twoFaData,
    };
  } catch (e) {
    return null;
  }
};
