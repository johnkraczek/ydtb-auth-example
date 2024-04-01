import { v4 as uuidv4 } from "uuid";
import { relations } from "drizzle-orm";
import { createTable } from "../../utils";
import { boolean, json, text, unique } from "drizzle-orm/pg-core";
import { users } from "./user-account";

export enum TwoFaType {
  "SMS" = "SMS",
  "EMAIL" = "Email",
  "AUTHENTICATOR" = "Authenticator",
}

type smsMethod = {
  method: "SMS";
  phone: string;
};

type emailMethod = {
  method: "EMAIL";
};

export type authenticatorMethod = {
  method: "AUTHENTICATOR";
  secret: string;
};

export type twoFaMethod = smsMethod | emailMethod | authenticatorMethod;

export type twoFactorDisplay = {
  method: string;
  label: string;
};

// =================== TABLE DEFINITION ===================

export const twoFactorMethod = createTable(
  "two_factor_method",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => {
        return uuidv4();
      }),
    userID: text("user_id").notNull(),
    twoFaData: json("two_factor_data").$type<twoFaMethod>(),
    twoFaType: text("two_fa_type").notNull(),
    status: boolean("status").default(false).notNull(),
  },
  (t) => ({
    uniquePair: unique().on(t.twoFaType, t.userID),
  }),
);

// =================== RELATIONSHIPS ===================

export const twoFaMethodRelation = relations(twoFactorMethod, ({ one }) => ({
  user: one(users, {
    fields: [twoFactorMethod.userID],
    references: [users.id],
  }),
}));
