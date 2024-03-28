"use server";
import { and, eq, lt, or } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "~/server/db";
import { token } from "~/server/db/schemas/";
import { TokenType } from "~/server/db/schemas/users/user-token";
import crypto from "crypto";

export async function getTokenByToken(tokenNum: string, type: TokenType) {
  try {
    const result = await db.query.token.findFirst({
      where: and(eq(token.value, tokenNum), eq(token.type, type)),
    });
    if (!result) return null;

    if (result.expires < new Date()) {
      await removeTokenByID(result.id, type);
      return null;
    }

    return result;
  } catch (e) {
    return null;
  }
}

/**
 * Get a verification token for the user by email.
 * @param email
 * @returns
 */
export async function getTokenIdByEmail(email: string, type: TokenType) {
  try {
    const result = await db.query.token.findFirst({
      where: and(eq(token.email, email), eq(token.type, type)),
    });
    if (!result) return null;

    if (result.expires < new Date()) {
      await removeTokenByID(result.id, type);
      return null;
    }

    return result.id;
  } catch (e) {
    return null;
  }
}

/**
 * @param email
 * @param token
 * @param type
 */
export async function validateToken(
  email: string,
  code: string,
  type: TokenType,
) {
  try {
    const result = await db.query.token.findFirst({
      where: and(
        eq(token.email, email),
        eq(token.type, type),
        eq(token.value, code),
      ),
    });
    if (!result) return false;
    if (result.expires < new Date()) {
      await removeTokenByID(result.id, type);
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Generate a new Verification token and store it in the database. Remove any existing tokens for the email.
 * @param email
 * @returns the token string
 */
export async function generateToken(
  email: string,
  type: TokenType,
): Promise<string> {
  const existingTokenId = await getTokenIdByEmail(email, type);
  if (existingTokenId) {
    await db.delete(token).where(eq(token.id, existingTokenId));
  }

  const newToken =
    type == TokenType.TWOFA_EMAIL_TOKEN || type == TokenType.TWOFA_SMS_TOKEN
      ? crypto.randomInt(100_000, 1_000_000).toString()
      : uuidv4();
  if (!newToken) throw new Error("Token generation failed");

  const expires = new Date(new Date().getTime() + 1000 * 3600);

  await db.insert(token).values({
    email,
    value: newToken,
    expires,
    type,
  });

  return newToken;
}

/**
 * Remove a verification token by id.
 * @param tokenId
 */
export async function removeTokenByID(tokenId: string, type: TokenType) {
  await db
    .delete(token)
    .where(
      and(
        eq(token.type, type),
        or(eq(token.id, tokenId), lt(token.expires, new Date())),
      ),
    );
}
