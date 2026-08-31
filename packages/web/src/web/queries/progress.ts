import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useHistory(enabled: boolean) {
  return useQuery(orpc.progress.history.queryOptions({ enabled, staleTime: 10_000 }));
}

export function useMissed(enabled: boolean) {
  return useQuery(orpc.progress.missed.queryOptions({ enabled, staleTime: 10_000 }));
}

export function useChapterStats(enabled: boolean) {
  return useQuery(orpc.progress.chapterStats.queryOptions({ enabled, staleTime: 10_000 }));
}

export function useRecordExam() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.progress.recordExam.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.progress.history.key() });
      },
    }),
  );
}

export function useRecordMiss() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.progress.recordMiss.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.progress.missed.key() });
      },
    }),
  );
}

export function useClearMiss() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.progress.clearMiss.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.progress.missed.key() });
      },
    }),
  );
}

export function useRecordAnswer() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.progress.recordAnswer.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.progress.chapterStats.key() });
      },
    }),
  );
}
