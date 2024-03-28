"use server";
import {
  getUserAccountsByUserId,
  unlinkUserAccountByProvider,
} from "~/server/data/providers";
import { currentUser } from "../user";

export type UserOAuthProfile = {
  providerName: string;
  name: string;
  email: string;
  image: string;
};

export const getOAuthAccounts = async (): Promise<
  UserOAuthProfile[] | undefined
> => {
  const user = await currentUser();

  if (!user) return;
  const oAuthAccounts = await getUserAccountsByUserId(user?.id!);
  return oAuthAccounts?.map((account): UserOAuthProfile => {
    return {
      providerName: account.provider,
      name: account.accountName || "",
      email: account.email || "",
      image: account.accountImage || "",
    };
  });
};

export const removeProviderAccount = async (provider: string) => {
  const user = await currentUser();
  if (!user) return;
  return unlinkUserAccountByProvider({ userId: user.id!, provider });
};
