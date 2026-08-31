import { useMutation } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useDeleteAccount() {
  return useMutation(orpc.account.deleteAccount.mutationOptions());
}
