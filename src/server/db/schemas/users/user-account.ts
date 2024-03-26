// =================== USER ROLE OPTIONS ===================

import { boolean, json, text, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "../../utils";
import { relations } from "drizzle-orm";
import { accounts } from "./provider-account";
import { v4 as uuidv4 } from "uuid";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

// =================== TABLE DEFINITION ===================

export const users = createTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => {
      return uuidv4();
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
