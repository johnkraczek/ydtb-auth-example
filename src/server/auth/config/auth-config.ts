import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NextAuthConfig } from "next-auth";
import { db } from "~/server/db";
import { createTable } from "~/server/db/utils";

export const authConfig = {
  providers: [],
  adapter: DrizzleAdapter(db, createTable),
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
