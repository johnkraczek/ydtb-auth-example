import { type User } from "next-auth";
import { updateAccountProfileInfo } from "~/server/data/providers";
import { setUserEmailAsVerified } from "~/server/data/user";

export async function linkedAccountEvent({
  user,
  profile,
}: {
  user: User;
  profile: User;
}) {
  if (!user.email) {
    return;
  }

  if (user.email == profile.email) {
    setUserEmailAsVerified(user.email);
  }
  updateAccountProfileInfo({ user, profile });
}
