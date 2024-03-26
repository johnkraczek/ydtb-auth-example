import {
  type Session,
  type User,
  type Account,
  DefaultSession,
} from "next-auth";
import { type JWT } from "next-auth/jwt";
import { emailVerifiedByID } from "~/server/data/user";
import { UserRole } from "~/server/db/schemas/users/user-account";

declare module "next-auth/jwt" {
  interface JWT {
    userRoles: UserRole[];
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      roles: UserRole[];
      isTwoFactorEnabled: boolean;
    } & DefaultSession["user"];
  }
}

export async function sessionCallback({
  session,
  token,
}: {
  session: Session;
  token?: JWT;
}) {
  return session;
}

export async function jwtCallback({ token }: { token: JWT }) {
  return token;
}

export async function signInCallback({
  user,
  account,
}: {
  user: User;
  account: Account | null;
}) {
  if (account?.provider !== "credentials") return true;
  if (!user || !user.id) return false;
  // make sure that the user has verified their email
  //if (!(await emailVerifiedByID(user.id))) return false;

  //@TODO check if they have two factor authentication

  return true;
}
