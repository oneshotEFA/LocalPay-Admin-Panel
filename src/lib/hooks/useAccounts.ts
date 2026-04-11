import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  accountsApi,
  type UpsertAccountBody,
} from "@/lib/api/client";
import { queryKeys } from "./queryKeys";

export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts(),
    queryFn: () => accountsApi.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertAccountBody) => accountsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.accounts() });
      qc.invalidateQueries({ queryKey: queryKeys.banks() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard() });
    },
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & UpsertAccountBody) =>
      accountsApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.accounts() });
      qc.invalidateQueries({ queryKey: queryKeys.banks() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard() });
    },
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.accounts() });
      qc.invalidateQueries({ queryKey: queryKeys.banks() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard() });
    },
  });
}
