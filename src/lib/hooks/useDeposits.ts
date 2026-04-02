import { useQuery } from "@tanstack/react-query";
import { depositsApi, type DepositListParams } from "@/lib/api/client";
import { queryKeys } from "./queryKeys";

export function useDeposits(params: DepositListParams = {}) {
  return useQuery({
    queryKey: queryKeys.deposits(params),
    queryFn: () => depositsApi.list(params),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useDeposit(id: string) {
  return useQuery({
    queryKey: queryKeys.deposit(id),
    queryFn: async () => (await depositsApi.get(id)).item,
    staleTime: 60 * 1000,
    enabled: !!id,
  });
}
