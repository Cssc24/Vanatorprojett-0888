import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";

/**
 * Better Auth tables (generated) + app tables for exam progress.
 * Apply with `bun run db:push` from packages/web.
 */
export * from "./auth-schema";

/** One finished exam simulation (30 questions, 60 min). */
export const examAttempts = sqliteTable(
  "exam_attempts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull(),
    score: integer("score").notNull(),
    total: integer("total").notNull(),
    durationSec: integer("duration_sec").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [index("exam_attempts_user_idx").on(t.userId, t.createdAt)],
);

/** Questions the user got wrong — cleared once answered correctly. */
export const missedQuestions = sqliteTable(
  "missed_questions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull(),
    chapter: text("chapter").notNull(),
    question: text("question").notNull(),
    misses: integer("misses").notNull().default(1),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [uniqueIndex("missed_user_question_idx").on(t.userId, t.chapter, t.question)],
);

/** Per-chapter aggregated study stats (flashcards known / quiz answers). */
export const chapterStats = sqliteTable(
  "chapter_stats",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull(),
    chapter: text("chapter").notNull(),
    seen: integer("seen").notNull().default(0),
    correct: integer("correct").notNull().default(0),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [uniqueIndex("chapter_stats_user_idx").on(t.userId, t.chapter)],
);
