import { useQuery } from "@tanstack/react-query";
import { checkoutsApi, type CheckoutListParams } from "@/lib/api/client";
import { queryKeys } from "./queryKeys";

export function useCheckouts(params: CheckoutListParams = {}) {
  return useQuery({
    queryKey: queryKeys.checkouts(params),
    queryFn: () => checkoutsApi.list(params),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useCheckout(id: string) {
  return useQuery({
    queryKey: queryKeys.checkout(id),
    queryFn: async () => (await checkoutsApi.get(id)).item,
    staleTime: 60 * 1000,
    enabled: !!id,
  });
}
