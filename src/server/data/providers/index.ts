import { eq } from "drizzle-orm/sql";
import { User } from "next-auth";

import { getUserById, updateUserProfileImage } from "../user";
import { accounts } from "~/server/db/schemas";
import { db } from "~/server/db";

export const getUserAccountsByUserId = async (userId: string) => {
  // @TODO VERIFY AUTHORIZATION
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
  profile,
}: {
  user: User;
  profile: User;
}) => {
  // @TODO VERIFY AUTHORIZATION

  if (user && user.id) {
    const eUser = await getUserById(user.id);
    if (!eUser?.image && profile.image) {
      updateUserProfileImage({ id: user.id, imgURL: profile.image });
    }
  }
  await db
    .update(accounts)
    .set({
      email: profile.email,
      accountName: profile.name,
      accountImage: profile.image,
    })
    .where(eq(accounts.providerAccountId, profile.id!));
};

export const unlinkUserAccountByProvider = async ({
  userId,
  provider,
}: {
  userId: string;
  provider: string;
}) => {
  // @TODO VERIFY AUTHORIZATION

  return await db
    .delete(accounts)
    .where(eq(accounts.userId, userId) && eq(accounts.provider, provider));
};
