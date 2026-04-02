import { useQuery } from "@tanstack/react-query";
import { transactionsApi, type TransactionListParams } from "@/lib/api/client";
import { queryKeys } from "./queryKeys";

export function useTransactions(params: TransactionListParams = {}) {
  return useQuery({
    queryKey: queryKeys.transactions(params),
    queryFn: () => transactionsApi.list(params),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: async () => (await transactionsApi.get(id)).item,
    staleTime: 60 * 1000,
    enabled: !!id,
  });
}
