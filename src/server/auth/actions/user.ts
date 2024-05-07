"use server";
import { auth } from "~/server/auth";
import { UserRole } from "~/server/db/schemas/users/user-account";

export type User = Awaited<ReturnType<typeof currentUser>>;

export const currentUser = async () => {
  const session = await auth();
  if (!session || !session.user) return false;
  return session.user;
};

export const currentUserCanPerformAction = async (userID: string) => {
  const user = await currentUser();
  if (!user) return false;
  if (user.id == userID || user.roles.includes(UserRole.ADMIN)) {
    return true;
  }
  return false;
};
