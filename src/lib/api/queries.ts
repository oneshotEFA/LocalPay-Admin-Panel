import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authApi,
  overviewApi,
  checkoutsApi,
  depositsApi,
  transactionsApi,
  accountsApi,
  apiKeysApi,
  settingsApi,
  type CheckoutListParams,
  type DepositListParams,
  type TransactionListParams,
  type CreateApiKeyBody,
  type UpsertAccountBody,
} from "./client";

export const queryKeys = {
  me: () => ["auth", "me"] as const,
  dashboard: () => ["dashboard"] as const,
  settings: () => ["settings"] as const,

  checkouts: (params?: CheckoutListParams) =>
    params ? ["checkouts", params] : (["checkouts"] as const),
  checkout: (id: string) => ["checkouts", id] as const,

  deposits: (params?: DepositListParams) =>
    params ? ["deposits", params] : (["deposits"] as const),
  deposit: (id: string) => ["deposits", id] as const,

  transactions: (params?: TransactionListParams) =>
    params ? ["transactions", params] : (["transactions"] as const),
  transaction: (id: string) => ["transactions", id] as const,

  accounts: () => ["accounts"] as const,
  apiKeys: () => ["api-keys"] as const,
};

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

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: () => overviewApi.dashboard(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings(),
    queryFn: () => settingsApi.get(),
    staleTime: 2 * 60 * 1000,
  });
}

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
      qc.invalidateQueries({ queryKey: queryKeys.dashboard() });
    },
  });
}

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
