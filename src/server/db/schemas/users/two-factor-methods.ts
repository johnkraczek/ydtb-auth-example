import { v4 as uuidv4 } from "uuid";
import { relations } from "drizzle-orm";
import { createTable } from "../../utils";
import { boolean, text, unique } from "drizzle-orm/pg-core";
import { users } from "./user-account";

type EnumValues<T> = T[keyof T];

export const TWO_FA_TYPE = {
  SMS: "SMS",
  EMAIL: "EMAIL",
  AUTHENTICATOR: "AUTHENTICATOR",
} as const;
export type TwoFaType = EnumValues<typeof TWO_FA_TYPE>;

export const TWO_FA_DISPLAY = {
  SMS: "SMS",
  EMAIL: "Email",
  AUTHENTICATOR: "Authenticator",
};

export const TWO_FA_LABELS = {
  EMAIL: "Email a code",
  SMS: "Get a Text Message",
  AUTHENTICATOR: "Use an Authenticator App",
} as const;
export type TwoFaLabel = EnumValues<typeof TWO_FA_LABELS>;

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
    twoFaData: text("two_Fa_Data"),
    twoFaType: text("two_fa_type", {
      enum: Object.keys(TWO_FA_TYPE) as [string, ...string[]],
    })
      .notNull()
      .$type<TwoFaType>(),
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
