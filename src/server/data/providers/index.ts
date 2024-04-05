"use server";
import { eq } from "drizzle-orm/sql";
import { Account, User } from "next-auth";

import { getUserById, updateUserProfileImage } from "../user";
import { accounts } from "~/server/db/schemas";
import { db } from "~/server/db";
import { currentUserCanPerformAction } from "~/server/auth/actions/user";

export const getUserAccountsByUserId = async (userId: string) => {
  if (!(await currentUserCanPerformAction(userId))) return;
  try {
    return await db.query.accounts.findMany({
      where: eq(accounts.userId, userId),
    });
  } catch {
    return null;
  }
};

export const updateAccountProfileInfo = async ({
  user,
  account,
  profile,
}: {
  user: User;
  account: Account;
  profile: User;
}) => {
  if (!(await currentUserCanPerformAction(user.id!))) return;

  if (user && user.id) {
    const eUser = await getUserById(user.id);
    if (!eUser?.image && profile.image) {
      updateUserProfileImage({ userID: user.id, imgURL: profile.image });
    }
  }

  await db
    .update(accounts)
    .set({
      email: profile.email,
      accountName: profile.name,
      accountImage: profile.image,
    })
    .where(eq(accounts.providerAccountId, account.providerAccountId!));
};

export const unlinkUserAccountByProvider = async ({
  userId,
  provider,
}: {
  userId: string;
  provider: string;
}) => {
  if (!(await currentUserCanPerformAction(userId))) return;

  return await db
    .delete(accounts)
    .where(eq(accounts.userId, userId) && eq(accounts.provider, provider));
};
