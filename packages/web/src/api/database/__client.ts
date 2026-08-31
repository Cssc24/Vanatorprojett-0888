// TEMPLATE-MANAGED (__ prefix) — do not edit. Define tables in ./schema.ts
// and query via: import { db } from "./database";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Trim so a stray space/tab/newline pasted into the env var (a common copy
// mistake) doesn't make libSQL reject the URL.
const client = createClient({
  url: process.env.DATABASE_URL?.trim() ?? "",
  authToken: process.env.DATABASE_AUTH_TOKEN?.trim() || undefined,
});

export const db = drizzle(client, { schema });
