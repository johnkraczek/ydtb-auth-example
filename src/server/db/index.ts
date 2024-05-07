import { env } from "~/env";
import * as schema from "~/server/db/schemas";
import { neon, neonConfig, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

if (env.NODE_ENV == "development") {
  neonConfig.fetchEndpoint = (host) => {
    const protocol = host === "db.localtest.me" ? "http" : "https";
    const port = host === "db.localtest.me" ? 4444 : 443;
    return `${protocol}://${host}:${port}/sql`;
  };
}

const sql: NeonQueryFunction<boolean, boolean> = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });
