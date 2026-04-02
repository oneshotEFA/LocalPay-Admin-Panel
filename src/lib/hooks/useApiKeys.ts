import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiKeysApi, type CreateApiKeyBody } from "@/lib/api/client";
import { queryKeys } from "./queryKeys";

export function useApiKeys() {
  return useQuery({
    queryKey: queryKeys.apiKeys(),
    queryFn: () => apiKeysApi.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateApiKeyBody) => apiKeysApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.apiKeys() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard() });
    },
  });
}

export function useRevokeApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiKeysApi.revoke(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.apiKeys() });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard() });
    },
  });
}
