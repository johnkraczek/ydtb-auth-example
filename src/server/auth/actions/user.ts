import { Session } from "next-auth";
import { auth } from "~/server/auth";

export type user = Session["user"];

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};
