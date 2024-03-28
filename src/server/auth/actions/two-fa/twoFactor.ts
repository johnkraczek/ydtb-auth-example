"use server";
/**
 * Abstraction of the two factor authentication process
 */
import { cookies } from "next/headers";
import { sign, verify } from "jsonwebtoken";
import { env } from "~/env";

// each two factor method will set a confirmation token in the user's httpOnly cookie
export async function generateConfirmationToken(
  email: string,
  expiration?: number,
) {
  const jwt = sign(
    {
      data: {
        email,
      },
    },
    env.NEXTAUTH_SECRET!,
  );
  cookies().set({
    name: "tokenConfirmation",
    value: jwt,
    httpOnly: true,
    path: "/",
    maxAge: expiration || 60, // 1 minute if you want them to not be required to 2FA again so soon
  });
}

type cookieData = {
  data: {
    email: string;
    token: string;
  };
  iat: number;
};

export async function getVerifiedConfirmationToken(
  email: string,
): Promise<boolean> {
  const cookie = cookies().get("tokenConfirmation");

  if (!cookie) return false;

  var decoded = (await verify(
    cookie.value,
    env.NEXTAUTH_SECRET!,
  )) as cookieData;
  if (decoded.data.email === email) {
    return true;
  }
  return false;
}
