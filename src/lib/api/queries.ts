/**
 * HabeshaUnlocker Portal — Centralized Query Hooks
 * All GET data fetching goes through these hooks. POST/mutations are separate.
 * Connect to real backend by wiring the api/client.ts functions.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
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
  type UpdateWebhookBody,
  type UpdateBrandingBody,
  type NotificationSettingsBody,
} from "./client";

// ─── Query Keys (factory pattern) ─────────────────────────────────────────────

export const queryKeys = {
  me: () => ["auth", "me"] as const,
  stats: () => ["overview", "stats"] as const,

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
  settings: () => ["settings"] as const,
};

// ─── Auth ──────────────────────────────────────────────────────────────────────

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: authApi.me,
    staleTime: 5 * 60 * 1000, // 5 min
    retry: 1,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.me() });
    },
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

// ─── Overview ─────────────────────────────────────────────────────────────────

export function useOverviewStats() {
  return useQuery({
    queryKey: queryKeys.stats(),
    queryFn: overviewApi.stats,
    staleTime: 2 * 60 * 1000, // 2 min — stats refresh often
  });
}

// ─── Checkouts ────────────────────────────────────────────────────────────────

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
    queryFn: () => checkoutsApi.get(id),
    staleTime: 60 * 1000,
    enabled: !!id,
  });
}

// ─── Deposits ─────────────────────────────────────────────────────────────────

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
    queryFn: () => depositsApi.get(id),
    staleTime: 60 * 1000,
    enabled: !!id,
  });
}

// ─── Transactions ─────────────────────────────────────────────────────────────

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
    queryFn: () => transactionsApi.get(id),
    staleTime: 60 * 1000,
    enabled: !!id,
  });
}

// ─── Receiving Accounts ───────────────────────────────────────────────────────

export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts(),
    queryFn: accountsApi.list,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertAccountBody) => accountsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.accounts() });
    },
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<UpsertAccountBody>) =>
      accountsApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.accounts() });
    },
  });
}

export function useToggleAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountsApi.toggle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.accounts() });
    },
  });
}

// ─── API Keys ─────────────────────────────────────────────────────────────────

export function useApiKeys() {
  return useQuery({
    queryKey: queryKeys.apiKeys(),
    queryFn: apiKeysApi.list,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateApiKeyBody) => apiKeysApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.apiKeys() });
    },
  });
}

export function useRevokeApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiKeysApi.revoke(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.apiKeys() });
    },
  });
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings(),
    queryFn: settingsApi.get,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateWebhookBody) => settingsApi.updateWebhook(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.settings() });
    },
  });
}

export function useUpdateBranding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateBrandingBody) => settingsApi.updateBranding(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.settings() });
    },
  });
}

export function useUpdateNotifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: NotificationSettingsBody) =>
      settingsApi.updateNotifications(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.settings() });
    },
  });
}

export function useTestWebhook() {
  return useMutation({
    mutationFn: settingsApi.testWebhook,
  });
}
