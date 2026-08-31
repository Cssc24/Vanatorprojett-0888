import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "turso",
  schema: "./src/api/database/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL?.trim() ?? "",
    authToken: process.env.DATABASE_AUTH_TOKEN?.trim() || undefined,
  },
});
