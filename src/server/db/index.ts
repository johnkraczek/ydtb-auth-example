import { env } from "~/env";
import * as schema from "~/server/db/schemas";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql: NeonQueryFunction<boolean, boolean> = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });
