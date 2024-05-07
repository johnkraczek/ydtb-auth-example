"use server";

import { z } from "zod";
import { Result } from "~/types/result";
import { profileFormSchema } from "~/validation/settings";
import { currentUser } from "../auth/actions/user";
import { getUserById, updateUserData } from "../data/user";
import { getUserAccountsByUserId } from "../data/providers";

export const SettingsFormAction = async (
  values: z.infer<typeof profileFormSchema>,
): Promise<Result> => {
  const validatedFields = profileFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "invalid fields",
    };
  }

  const safeValues = (({ id, ...values }) => values)(validatedFields.data);

  const user = await currentUser();
  if (!user) {
    return {
      success: false,
      message: "invalid user",
    };
  }

  const existingUser = getUserById(user.id!);
  if (!existingUser) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const result = updateUserData({
    userID: user.id!,
    values: safeValues,
  });

  return {
    success: true,
    message: "default true",
  };
};

export const FetchSettingsFormData = async () => {
  const user = await currentUser();
  if (!user) return;

  const existingUser = await getUserById(user.id!);
  if (!existingUser) return;

  const providers = await getUserAccountsByUserId(existingUser.id);

  let verifiedEmails: string[] = [];
  let images: string[] = [];
  if (existingUser.emailVerified) {
    verifiedEmails?.push(existingUser.email);
  }

  providers?.forEach((provider) => {
    if (provider.email && !verifiedEmails.includes(provider.email))
      verifiedEmails.push(provider.email);
    if (provider.accountImage && !images.includes(provider.accountImage))
      images.push(provider.accountImage);
  });

  return {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    emails: verifiedEmails,
    image: existingUser.image,
    images: images,
    roles: existingUser.roles,
  };
};
