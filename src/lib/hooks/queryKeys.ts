import type {
  CheckoutListParams,
  DepositListParams,
  TransactionListParams,
} from "@/lib/api/client";

type BanksListParams = { countryCode?: string };

export const queryKeys = {
  me: () => ["auth", "me"] as const,
  dashboard: () => ["dashboard"] as const,
  settings: () => ["settings"] as const,

  checkouts: (params?: CheckoutListParams) =>
    params ? (["checkouts", params] as const) : (["checkouts"] as const),
  checkout: (id: string) => ["checkouts", id] as const,

  deposits: (params?: DepositListParams) =>
    params ? (["deposits", params] as const) : (["deposits"] as const),
  deposit: (id: string) => ["deposits", id] as const,

  transactions: (params?: TransactionListParams) =>
    params ? (["transactions", params] as const) : (["transactions"] as const),
  transaction: (id: string) => ["transactions", id] as const,

  accounts: () => ["accounts"] as const,
  banks: (params?: BanksListParams) =>
    params ? (["banks", params] as const) : (["banks"] as const),
  apiKeys: () => ["api-keys"] as const,
};
