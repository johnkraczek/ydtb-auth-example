import { primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "../../utils";
import { v4 as uuidv4 } from "uuid";

export enum TokenType {
  PASS_RESET_TOKEN = "PASSWORD",
  TWOFA_EMAIL_TOKEN = "2FA_EMAIL",
  TWOFA_SMS_TOKEN = "2FA_SMS",
  VERIFY_EMAIL_TOKEN = "VERIFY_EMAIL",
}

export const token = createTable(
  "token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => {
        return uuidv4();
      }),
    email: text("email").notNull(),
    type: text("token_type", {
      enum: ["", ...Object.values(TokenType)],
    })
      .$type<TokenType>()
      .notNull(),
    value: text("value").notNull(),
    expires: timestamp("expires").notNull().$type<Date>(),
  },
  (token) => ({
    compoundKey: primaryKey({
      columns: [token.email, token.type],
    }),
  }),
);
