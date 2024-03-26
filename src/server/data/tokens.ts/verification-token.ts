import "server-only";
import { eq, lt } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "~/server/db";
import { token } from "~/server/db/schemas/";
import { TokenType } from "~/server/db/schemas/users/user-token";

/**
 * Get a verification token for the user by email.
 * @param email
 * @returns
 */
export async function getVerificationTokenIdByEmail(email: string) {
  try {
    const result = await db.query.token.findFirst({
      where:
        eq(token.email, email) && eq(token.type, TokenType.VERIFY_EMAIL_TOKEN),
    });
    if (!result) return null;
    return result.id;
  } catch (e) {
    return null;
  }
}

/**
 * Get a verification token for a user by the token string.
 * @param token
 * @returns
 */
export async function getVerificationTokenIdByToken(tokenNum: string) {
  try {
    const result = await db.query.token.findFirst({
      where:
        eq(token.value, tokenNum) &&
        eq(token.type, TokenType.VERIFY_EMAIL_TOKEN),
    });
    if (!result) return null;
    return result.id;
  } catch (e) {
    return null;
  }
}

/**
 * Generate a new Verification token and store it in the database. Remove any existing tokens for the email.
 * @param email
 * @returns the token string
 */
export async function generateVerificationToken(
  email: string,
): Promise<string> {
  const existingTokenId = await getVerificationTokenIdByEmail(email);
  if (existingTokenId) {
    await db.delete(token).where(eq(token.id, existingTokenId));
  }

  const newToken = uuidv4().split("-")[0];
  if (!newToken) throw new Error("Token generation failed");

  const expires = new Date(new Date().getTime() + 1000 * 3600);
  await db.insert(token).values({
    email,
    value: newToken,
    expires,
    type: TokenType.VERIFY_EMAIL_TOKEN,
  });

  return newToken;
}

/**
 * Remove a verification token by id.
 * @param tokenId
 */
export async function removeVerificationToken(tokenId: string) {
  await db
    .delete(token)
    .where(
      eq(token.type, TokenType.VERIFY_EMAIL_TOKEN) &&
        (eq(token.id, tokenId) || lt(token.expires, new Date())),
    );
}
