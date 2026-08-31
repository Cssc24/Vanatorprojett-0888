import { z } from "zod";
import { base } from "../__core/app";
import chapters from "../data/questions.json";

export type Question = { q: string; options: string[]; answer: number };
export type Chapter = { key: string; label: string; questions: Question[] };

const CHAPTERS = chapters as Chapter[];
const byKey = new Map(CHAPTERS.map((c) => [c.key, c]));

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const chapterList = CHAPTERS.map((c) => ({
  key: c.key,
  label: c.label,
  count: c.questions.length,
}));

export const exam = {
  /** Chapter index with question counts. */
  chapters: base.handler(() => ({
    chapters: chapterList,
    total: chapterList.reduce((s, c) => s + c.count, 0),
  })),

  /** All questions of one chapter, optionally shuffled. */
  chapter: base
    .input(z.object({ key: z.string(), shuffle: z.boolean().default(true) }))
    .handler(({ input }) => {
      const chapter = byKey.get(input.key);
      if (!chapter) return { key: input.key, label: "", questions: [] };
      const questions = input.shuffle ? shuffle(chapter.questions) : chapter.questions;
      return { key: chapter.key, label: chapter.label, questions };
    }),

  /** Random draw for a chapter quiz. */
  quiz: base
    .input(z.object({ key: z.string(), size: z.number().min(1).max(50).default(10) }))
    .handler(({ input }) => {
      const chapter = byKey.get(input.key);
      if (!chapter) return { key: input.key, label: "", questions: [] };
      return {
        key: chapter.key,
        label: chapter.label,
        questions: shuffle(chapter.questions).slice(0, input.size),
      };
    }),

  /** Exam draw: N random questions across every chapter. */
  draw: base
    .input(z.object({ size: z.number().min(5).max(60).default(30) }))
    .handler(({ input }) => {
      const pool = CHAPTERS.flatMap((c) =>
        c.questions.map((q) => ({ chapter: c.key, chapterLabel: c.label, ...q })),
      );
      return { questions: shuffle(pool).slice(0, input.size) };
    }),

  /** Rehydrate specific questions (used by "greșelile mele"). */
  lookup: base
    .input(z.object({ items: z.array(z.object({ chapter: z.string(), question: z.string() })) }))
    .handler(({ input }) => {
      const out: {
        chapter: string;
        chapterLabel: string;
        q: string;
        options: string[];
        answer: number;
      }[] = [];
      for (const item of input.items) {
        const chapter = byKey.get(item.chapter);
        const found = chapter?.questions.find((q) => q.q === item.question);
        if (chapter && found) {
          out.push({ chapter: chapter.key, chapterLabel: chapter.label, ...found });
        }
      }
      return { questions: out };
    }),
};
