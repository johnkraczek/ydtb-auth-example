import {
  type Session,
  type User,
  type Account,
  DefaultSession,
} from "next-auth";
import { type JWT } from "next-auth/jwt";
import {
  emailVerifiedByID,
  getUserById,
  isUserEmailVerified,
} from "~/server/data/user";
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
  if (!session.user || !token || !token.sub) return session;
  session.user.id = token.sub;
  session.user.roles = token.userRoles;
  session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
  session.user.name = token.name;
  session.user.email = token.email;
  return session;
}

export async function jwtCallback({ token }: { token: JWT }) {
  if (!token.sub) return token;
  const user = await getUserById(token.sub);
  if (!user) return token;
  token.name = user.name;
  token.email = user.email;
  token.userRoles = user.roles || [UserRole.USER];
  token.isTwoFactorEnabled = user.isTwoFactorEnabled || false;
  return token;
}

export async function signInCallback({
  user,
  account,
}: {
  user: User;
  account: Account | null;
}) {
  console.log("SignIn Account:", account);

  if (account?.provider !== "credentials") return true;
  if (!user || !user.id || !user.email) return false;
  const emailVerified = await isUserEmailVerified(user.email);
  if (!emailVerified) return false;

  //@TODO check if they have two factor authentication

  return true;
}
