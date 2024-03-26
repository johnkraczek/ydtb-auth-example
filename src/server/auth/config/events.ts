import { type User, type Account, Profile } from "next-auth";

export async function linkedAccountEvent({
  user,
  account,
  profile,
}: {
  user: User;
  account: Account;
  profile: User;
}) {}
