import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/client";
import { queryKeys } from "./queryKeys";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: authApi.me,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      qc.clear();
    },
  });
}
