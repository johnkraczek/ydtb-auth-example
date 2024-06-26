// =================== USER ROLE OPTIONS ===================

import { boolean, json, text, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "../../utils";
import { relations } from "drizzle-orm";
import { accounts } from "./provider-account";
import { v4 as uuidv4 } from "uuid";
import { twoFactorMethod } from "./two-factor-methods";
import { token } from "./user-token";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

// =================== TABLE DEFINITION ===================

export const users = createTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn((): string => {
      const id = uuidv4();
      return id;
    }),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  hashedPassword: text("hashedPassword").default("").notNull(),
  roles: json("roles").$type<UserRole[]>().default([UserRole.USER]),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
});

// =================== RELATIONSHIPS ===================

export const usersAccountRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const usersTwoFaMethods = relations(users, ({ many }) => ({
  twoFactorMethod: many(twoFactorMethod),
}));

export const usersTokenRelations = relations(users, ({ many }) => ({
  token: many(token),
}));
