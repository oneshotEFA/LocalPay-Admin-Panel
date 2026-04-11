import { useQuery } from "@tanstack/react-query";
import { banksApi } from "@/lib/api/client";
import { queryKeys } from "./queryKeys";

export function useBanks(params?: { countryCode?: string }) {
  return useQuery({
    queryKey: queryKeys.banks(params),
    queryFn: () => banksApi.list(params ?? {}),
    staleTime: 5 * 60 * 1000,
  });
}
