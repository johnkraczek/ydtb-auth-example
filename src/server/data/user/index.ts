import "server-only";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { users } from "~/server/db/schemas";
import bcryptjs from "bcryptjs";

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
  // return the user minus the hashedPassword, if you wanted to leave out other bits you could add them to the list.
  //https://www.codemzy.com/blog/copying-object-without-property-javascript
  return (({ hashedPassword, ...user }) => user)(user);
};
/**
 *  Getter for the user by email.
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
