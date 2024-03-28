import "server-only";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { users } from "~/server/db/schemas";
import bcryptjs from "bcryptjs";

export type User = Awaited<ReturnType<typeof getUserById>>;

/**
 *  Getter for the user by email.
 * @param email
 * @returns
 */
export const getUserByEmail = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) {
    return null;
  }
  // return the user minus the hashedPassword
  // https://www.codemzy.com/blog/copying-object-without-property-javascript
  return (({ hashedPassword, ...user }) => user)(user);
};

export const getUserById = async (id: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  if (!user) {
    return null;
  }
  return (({ hashedPassword, ...user }) => user)(user);
};

/**
 * @param email
 * @returns boolean
 */
export const userExistsByEmail = async (
  email: string,
  strict = false,
): Promise<boolean> => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (strict && (!user || !user.email || !user.hashedPassword)) {
    return false;
  }

  return !!user;
};

/**
 * Return boolean if the user has verified their email
 * @param email
 * @returns
 */

export const isUserEmailVerified = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return !(!user || !user.email || !user.emailVerified);
};

/**
 * Create a new user
 */
export const createUser = async (user: {
  name: string;
  email: string;
  password: string;
}) => {
  const hashed = await bcryptjs.hash(user.password, 10);
  return await db.insert(users).values({
    name: user.name,
    email: user.email,
    hashedPassword: hashed,
  });
};

/**
 * @param email
 * @param password
 * @returns
 */
export const verifyUserCredentials = async (
  email: string,
  password: string,
) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) return false;
  return await bcryptjs.compare(password, user.hashedPassword);
};

/**
 * Is email verified?
 */
export const emailVerifiedByID = async (id: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user || !user.emailVerified) return false;

  return true;
};

/**
 * verify the users email address.
 *
 * @param email
 * @returns the database response.
 */
export const setUserEmailAsVerified = async (email: string) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser?.emailVerified) {
    return;
  }
  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      isTwoFactorEnabled: true,
    })
    .where(eq(users.email, email));
};

export const updateUserPass = async (id: string, password: string) => {
  const hashedPassword = await bcryptjs.hash(password, 10);
  return await db
    .update(users)
    .set({
      hashedPassword,
    })
    .where(eq(users.id, id));
};

export const updateUserProfileImage = async ({
  id,
  imgURL,
}: {
  id: string;
  imgURL: string;
}) => {
  await db.update(users).set({ image: imgURL }).where(eq(users.id, id));
};
