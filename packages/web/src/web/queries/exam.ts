import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useChapters() {
  return useQuery(orpc.exam.chapters.queryOptions({ staleTime: Infinity }));
}

export function useChapterQuestions(key: string, enabled = true) {
  return useQuery(
    orpc.exam.chapter.queryOptions({
      input: { key, shuffle: true },
      enabled: enabled && key.length > 0,
      staleTime: 60_000,
    }),
  );
}

export function useQuiz(key: string, size: number, enabled = true) {
  return useQuery(
    orpc.exam.quiz.queryOptions({
      input: { key, size },
      enabled: enabled && key.length > 0,
      staleTime: 0,
      gcTime: 0,
    }),
  );
}

export function useExamDraw(size: number, enabled: boolean) {
  return useQuery(
    orpc.exam.draw.queryOptions({ input: { size }, enabled, staleTime: 0, gcTime: 0 }),
  );
}

export function useLookup(items: { chapter: string; question: string }[], enabled: boolean) {
  return useQuery(
    orpc.exam.lookup.queryOptions({
      input: { items },
      enabled: enabled && items.length > 0,
      staleTime: 60_000,
    }),
  );
}

export function useSeasons() {
  return useQuery(orpc.catalog.seasons.queryOptions({ staleTime: Infinity }));
}

export function useFacts() {
  return useQuery(orpc.catalog.facts.queryOptions({ staleTime: Infinity }));
}
