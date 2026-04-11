import { betterAuthClient } from "@/lib/better-auth/client";
import { clearAuthToken, getAuthToken } from "@/lib/better-auth/token";
import type {
  ClientReceivingAccount,
  DepositRequest,
  GatewayCheckout,
  PaymentMethod,
  Transaction,
  Verification,
  Receipt,
  CrawlResult,
} from "../types";

/** Browser calls this app’s Route Handler; the server forwards to the real backend. */
const GATEWAY_PREFIX = "/api/gateway-client";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${GATEWAY_PREFIX}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: "no-store", // ✅ ADD THIS
  });
  if (res.status === 204) return undefined as T;
  // if (res.status == 401 || res.status == 403) {
  //   clearAuthToken();
  //   window.location.href = "/login";
  //   return undefined as T;
  // }
  if (!res.ok) {
    let code = "UNKNOWN_ERROR";
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      code = body.code ?? code;
      message = body.message ?? message;
    } catch {}
    throw new ApiError(res.status, code, message);
  }

  return res.json() as Promise<T>;
}

function adminPath(path: string) {
  return `/${path}`;
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== "") q.set(k, String(v));
  });
  const query = q.toString();
  return query ? `?${query}` : "";
}

// Auth remains untouched for when the backend auth endpoints are ready.
export const authApi = {
  signInEmail: (email: string, password: string) =>
    betterAuthClient.signInEmail(email, password),

  signUpEmail: (input: { email: string; password: string; name?: string }) =>
    betterAuthClient.signUpEmail(input),

  logout: async () => betterAuthClient.signOut(),

  session: () => betterAuthClient.getSession(),

  me: async () => {
    const session = await betterAuthClient.getSession();
    if (!session?.user) {
      throw new ApiError(401, "UNAUTHENTICATED", "Not authenticated");
    }
    return {
      id: session.user.id,
      name: session.user.name ?? session.user.email,
      clientId: session.user.clientId ?? "",
    };
  },
};

export interface ClientProfileResponse {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  webhookUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OverviewStats {
  monthStart: string;
  totalApiKeys: number;
  activeApiKeys: number;
  totalAccounts: number;
  activeAccounts: number;
  checkoutsThisMonth: number;
  pendingCheckouts: number;
  depositsThisMonth: number;
  pendingDeposits: number;
  fundedTransactionsThisMonth: number;
  fundedAmountThisMonth: number;
}

export interface DashboardTransaction extends Transaction {
  deposit: DepositRequest | null;
}

export interface DashboardResponse {
  client: ClientProfileResponse;
  overview: OverviewStats;
  recentTransactions: DashboardTransaction[];
}

export interface CheckoutListParams extends Record<
  string,
  string | number | undefined
> {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  from?: string;
  to?: string;
}

export interface DepositListParams extends Record<
  string,
  string | number | undefined
> {
  page?: number;
  pageSize?: number;
  status?: string;
  paymentMethod?: string;
  search?: string;
  checkoutId?: string;
}

export interface TransactionListParams extends Record<
  string,
  string | number | undefined
> {
  page?: number;
  pageSize?: number;
  search?: string;
  from?: string;
  to?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

function normalizePaginatedResponse<T>(
  raw: Partial<PaginatedResponse<T>> | undefined,
  fallbackPage = 1,
  fallbackPageSize?: number,
): PaginatedResponse<T> {
  const items = Array.isArray(raw?.items) ? raw.items : [];
  const total =
    typeof raw?.total === "number" && Number.isFinite(raw.total)
      ? raw.total
      : items.length;
  const page =
    typeof raw?.page === "number" && raw.page > 0 ? raw.page : fallbackPage;
  const pageSize =
    typeof raw?.pageSize === "number" && raw.pageSize > 0
      ? raw.pageSize
      : fallbackPageSize && fallbackPageSize > 0
        ? fallbackPageSize
        : items.length;
  const derivedHasMore =
    pageSize > 0 ? page * pageSize < total : items.length < total;

  return {
    items,
    total,
    page,
    pageSize,
    hasMore:
      typeof raw?.hasMore === "boolean"
        ? raw.hasMore || derivedHasMore
        : derivedHasMore,
  };
}

export interface ApiKeyListItem {
  id: string;
  label: string | null;
  isActive: boolean;
  apiKeyPreview: string;
  apiSecretPreview: string;
  lastUsedAt: string | null;
  createdAt: string;
  revokedAt: string | null;
}

export interface ApiKeysListResponse {
  client: ClientProfileResponse;
  total: number;
  items: ApiKeyListItem[];
}

export interface CreateApiKeyBody {
  label: string;
}

export interface CreatedApiKeyResponse {
  item: ApiKeyListItem;
  credentials: {
    apiKey: string;
    apiSecret: string;
  };
}

export interface RevokeApiKeyResponse {
  item: ApiKeyListItem;
}

export interface UpsertAccountBody {
  paymentMethod?: PaymentMethod;
  accountName?: string;
  accountNumber?: string;
  isActive?: boolean;
}

export interface AccountsListResponse {
  client: ClientProfileResponse;
  total: number;
  items: ClientReceivingAccount[];
}

export interface AccountMutationResponse {
  item: ClientReceivingAccount;
}

export interface BankReceivingAccountSummary {
  id: string;
  accountNumber: string;
  accountName: string;
  isActive: boolean;
  updatedAt: string;
}

export interface BankListItem {
  id: string;
  name: string;
  parserKey: string;
  receivingAccount: BankReceivingAccountSummary | null;
}

export interface BanksListResponse {
  countryCode: string;
  total: number;
  items: BankListItem[];
}

type RawReceipt = Receipt;
type RawCrawlResult = CrawlResult;
type RawVerification = Verification;

type DepositUser = {
  authId: string;
  email: string | null;
  externalServiceId?: string | null;
  platformAccountId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username: string | null;
};

export interface DepositListItem extends Omit<
  DepositRequest,
  "clientId" | "receipt" | "verifications" | "crawlResult" | "checkout"
> {
  user?: DepositUser;
  checkout?: {
    id: string;
    invoiceId: string;
    status: string;
  } | null;
  transaction?: Transaction | null;
}

export interface DepositDetailItem extends Omit<
  DepositRequest,
  "clientId" | "receipt" | "verifications" | "crawlResult" | "checkout"
> {
  user: DepositUser;
  receipt: RawReceipt | null;
  crawlResult: RawCrawlResult | null;
  verifications: RawVerification[];
  checkout: {
    id: string;
    invoiceId: string;
    status: string;
  } | null;
  transaction: Transaction | null;
}

export interface CheckoutListItem extends Omit<
  GatewayCheckout,
  "depositRequest"
> {
  deposit?: DepositListItem | null;
}

export interface CheckoutDetailItem extends Omit<
  GatewayCheckout,
  "depositRequest"
> {
  deposit: DepositDetailItem | null;
}

export interface TransactionListItem extends Transaction {
  deposit?: DepositListItem | null;
}

export interface TransactionDetailItem extends Transaction {
  deposit: DepositDetailItem | null;
}

export const overviewApi = {
  dashboard: (_clientId?: string) =>
    request<DashboardResponse>(adminPath("/dashboard")),
};

export const apiKeysApi = {
  list: (_clientId?: string) =>
    request<ApiKeysListResponse>(adminPath("/api-keys")),

  create: (body: CreateApiKeyBody, _clientId?: string) =>
    request<CreatedApiKeyResponse>(adminPath("/api-keys"), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  revoke: (id: string, _clientId?: string) =>
    request<RevokeApiKeyResponse>(adminPath(`/api-keys/${id}/revoke`), {
      method: "POST",
    }),
};

export const accountsApi = {
  list: (_clientId?: string) =>
    request<AccountsListResponse>(adminPath("/accounts")),

  create: (body: UpsertAccountBody, _clientId?: string) =>
    request<AccountMutationResponse>(adminPath("/accounts"), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: UpsertAccountBody, _clientId?: string) =>
    request<AccountMutationResponse>(adminPath(`/accounts/${id}`), {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  remove: (id: string, _clientId?: string) =>
    request<AccountMutationResponse>(adminPath(`/accounts/${id}`), {
      method: "DELETE",
    }),
};

export const banksApi = {
  list: (params: { countryCode?: string } = {}, _clientId?: string) =>
    request<BanksListResponse>(`${adminPath("/banks")}${buildQuery(params)}`),
};

export const checkoutsApi = {
  list: async (params: CheckoutListParams = {}, _clientId?: string) =>
    normalizePaginatedResponse(
      await request<PaginatedResponse<CheckoutListItem>>(
        `${adminPath("/checkouts")}${buildQuery(params)}`,
      ),
      params.page,
      params.pageSize,
    ),

  get: (id: string, _clientId?: string) =>
    request<{ item: CheckoutDetailItem }>(adminPath(`/checkouts/${id}`)),
};

export const depositsApi = {
  list: async (params: DepositListParams = {}, _clientId?: string) =>
    normalizePaginatedResponse(
      await request<PaginatedResponse<DepositListItem>>(
        `${adminPath("/deposits")}${buildQuery(params)}`,
      ),
      params.page,
      params.pageSize,
    ),

  get: (id: string, _clientId?: string) =>
    request<{ item: DepositDetailItem }>(adminPath(`/deposits/${id}`)),
};

export const transactionsApi = {
  list: async (params: TransactionListParams = {}, _clientId?: string) =>
    normalizePaginatedResponse(
      await request<PaginatedResponse<TransactionListItem>>(
        `${adminPath("/transactions")}${buildQuery(params)}`,
      ),
      params.page,
      params.pageSize,
    ),

  get: (id: string, _clientId?: string) =>
    request<{ item: TransactionDetailItem }>(adminPath(`/transactions/${id}`)),
};

export const settingsApi = {
  get: (_clientId?: string) => overviewApi.dashboard(_clientId),
};
