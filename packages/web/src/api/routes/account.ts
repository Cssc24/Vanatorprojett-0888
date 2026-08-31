import { eq } from "drizzle-orm";
import { authed } from "../middleware/auth";
import { db } from "../database";
import * as schema from "../database/schema";
import { user } from "../database/auth-schema";

/** Account management for the signed-in user. */
export const account = {
  /**
   * Permanently delete the signed-in user and everything tied to them.
   * Deleting the `user` row cascades to `session` and `account`; the progress
   * tables are keyed by user id without a foreign key, so clear them first.
   */
  deleteAccount: authed.handler(async ({ context }) => {
    const uid = context.user.id;
    await db.delete(schema.examAttempts).where(eq(schema.examAttempts.userId, uid));
    await db.delete(schema.missedQuestions).where(eq(schema.missedQuestions.userId, uid));
    await db.delete(schema.chapterStats).where(eq(schema.chapterStats.userId, uid));
    await db.delete(user).where(eq(user.id, uid));
    return { ok: true };
  }),
};
