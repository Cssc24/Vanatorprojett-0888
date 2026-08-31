import { z } from "zod";
import { and, desc, eq, sql } from "drizzle-orm";
import { authed } from "../middleware/auth";
import { db } from "../database";
import * as schema from "../database/schema";

/**
 * User progress: exam attempts, missed questions, per-chapter stats.
 * Every query is scoped to `context.user.id`.
 */
export const progress = {
  /** Save a finished exam simulation. */
  recordExam: authed
    .input(
      z.object({
        score: z.number().min(0),
        total: z.number().min(1),
        durationSec: z.number().min(0).default(0),
      }),
    )
    .handler(async ({ input, context }) => {
      const [row] = await db
        .insert(schema.examAttempts)
        .values({
          userId: context.user.id,
          score: input.score,
          total: input.total,
          durationSec: input.durationSec,
        })
        .returning();
      return row!;
    }),

  /** Attempt history (newest first) + aggregates for the progress screen. */
  history: authed.handler(async ({ context }) => {
    const attempts = await db
      .select()
      .from(schema.examAttempts)
      .where(eq(schema.examAttempts.userId, context.user.id))
      .orderBy(desc(schema.examAttempts.createdAt))
      .limit(50);

    const count = attempts.length;
    const best = count ? Math.max(...attempts.map((a) => a.score)) : 0;
    const average = count ? attempts.reduce((s, a) => s + a.score, 0) / count : 0;
    const passed = attempts.filter((a) => a.score >= 20).length;

    return {
      attempts,
      stats: {
        count,
        best,
        average: Math.round(average * 10) / 10,
        passed,
        passRate: count ? Math.round((passed / count) * 100) : 0,
      },
    };
  }),

  /** Mark a question as missed (or bump its miss counter). */
  recordMiss: authed
    .input(z.object({ chapter: z.string(), question: z.string() }))
    .handler(async ({ input, context }) => {
      await db
        .insert(schema.missedQuestions)
        .values({
          userId: context.user.id,
          chapter: input.chapter,
          question: input.question,
          misses: 1,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [
            schema.missedQuestions.userId,
            schema.missedQuestions.chapter,
            schema.missedQuestions.question,
          ],
          set: {
            misses: sql`${schema.missedQuestions.misses} + 1`,
            updatedAt: new Date(),
          },
        });
      return { ok: true };
    }),

  /** Remove a question from the missed list (answered correctly). */
  clearMiss: authed
    .input(z.object({ chapter: z.string(), question: z.string() }))
    .handler(async ({ input, context }) => {
      await db
        .delete(schema.missedQuestions)
        .where(
          and(
            eq(schema.missedQuestions.userId, context.user.id),
            eq(schema.missedQuestions.chapter, input.chapter),
            eq(schema.missedQuestions.question, input.question),
          ),
        );
      return { ok: true };
    }),

  /** The user's missed questions, most-missed first. */
  missed: authed.handler(async ({ context }) => {
    const items = await db
      .select({
        chapter: schema.missedQuestions.chapter,
        question: schema.missedQuestions.question,
        misses: schema.missedQuestions.misses,
        updatedAt: schema.missedQuestions.updatedAt,
      })
      .from(schema.missedQuestions)
      .where(eq(schema.missedQuestions.userId, context.user.id))
      .orderBy(desc(schema.missedQuestions.misses), desc(schema.missedQuestions.updatedAt))
      .limit(300);
    return { items };
  }),

  /** Count one answer against a chapter's aggregate. */
  recordAnswer: authed
    .input(z.object({ chapter: z.string(), correct: z.boolean() }))
    .handler(async ({ input, context }) => {
      await db
        .insert(schema.chapterStats)
        .values({
          userId: context.user.id,
          chapter: input.chapter,
          seen: 1,
          correct: input.correct ? 1 : 0,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [schema.chapterStats.userId, schema.chapterStats.chapter],
          set: {
            seen: sql`${schema.chapterStats.seen} + 1`,
            correct: sql`${schema.chapterStats.correct} + ${input.correct ? 1 : 0}`,
            updatedAt: new Date(),
          },
        });
      return { ok: true };
    }),

  /** Per-chapter seen/correct totals. */
  chapterStats: authed.handler(async ({ context }) => {
    const items = await db
      .select({
        chapter: schema.chapterStats.chapter,
        seen: schema.chapterStats.seen,
        correct: schema.chapterStats.correct,
      })
      .from(schema.chapterStats)
      .where(eq(schema.chapterStats.userId, context.user.id));
    return { items };
  }),
};
