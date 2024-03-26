import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NextAuthConfig } from "next-auth";
import { db } from "~/server/db";
import { createTable } from "~/server/db/utils";
import { discordProvider, gitHubProvider, googleProvider } from "./providers";
import { jwtCallback, sessionCallback, signInCallback } from "./callbacks";
import { linkedAccountEvent } from "./events";

export const authConfig = {
  providers: [googleProvider, discordProvider, gitHubProvider],
  adapter: DrizzleAdapter(db, createTable),
  callbacks: {
    jwt: (params) => jwtCallback(params),
    session: (params) => sessionCallback(params),
    signIn: (params) => signInCallback(params),
  },
  events: {
    linkAccount: (params) => linkedAccountEvent(params),
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
