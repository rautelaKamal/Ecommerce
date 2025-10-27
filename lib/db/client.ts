import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Returns a Drizzle client bound to Neon HTTP driver.
 * Throws if DATABASE_URL is not configured at runtime.
 */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Please configure it in your environment.");
  }
  const client = neon(url);
  return drizzle({ client, schema });
}

export { schema };
