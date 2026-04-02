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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const DEFAULT_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADMIN_CLIENT_ID ?? "client-1234-5678";

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
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

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

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

function adminPath(path: string, clientId = DEFAULT_CLIENT_ID) {
  return `/admin/clients/${clientId}${path}`;
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
  login: (body: { email: string; password: string }) =>
    request<{ user: { id: string; email: string; name: string } }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    ),

  logout: () => request<void>("/auth/logout", { method: "POST" }),

  me: () =>
    request<{ id: string; email: string; name: string; clientId: string }>(
      "/auth/me",
    ),

  refresh: () =>
    request<{ accessToken: string }>("/auth/refresh", { method: "POST" }),
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
  dashboard: (clientId?: string) =>
    request<DashboardResponse>(adminPath("/dashboard", clientId)),
};

export const apiKeysApi = {
  list: (clientId?: string) =>
    request<ApiKeysListResponse>(adminPath("/api-keys", clientId)),

  create: (body: CreateApiKeyBody, clientId?: string) =>
    request<CreatedApiKeyResponse>(adminPath("/api-keys", clientId), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  revoke: (id: string, clientId?: string) =>
    request<RevokeApiKeyResponse>(
      adminPath(`/api-keys/${id}/revoke`, clientId),
      {
        method: "POST",
      },
    ),
};

export const accountsApi = {
  list: (clientId?: string) =>
    request<AccountsListResponse>(adminPath("/accounts", clientId)),

  create: (body: UpsertAccountBody, clientId?: string) =>
    request<AccountMutationResponse>(adminPath("/accounts", clientId), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: UpsertAccountBody, clientId?: string) =>
    request<AccountMutationResponse>(adminPath(`/accounts/${id}`, clientId), {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  remove: (id: string, clientId?: string) =>
    request<AccountMutationResponse>(adminPath(`/accounts/${id}`, clientId), {
      method: "DELETE",
    }),
};

export const checkoutsApi = {
  list: (params: CheckoutListParams = {}, clientId?: string) =>
    request<PaginatedResponse<CheckoutListItem>>(
      `${adminPath("/checkouts", clientId)}${buildQuery(params)}`,
    ),

  get: (id: string, clientId?: string) =>
    request<{ item: CheckoutDetailItem }>(
      adminPath(`/checkouts/${id}`, clientId),
    ),
};

export const depositsApi = {
  list: (params: DepositListParams = {}, clientId?: string) =>
    request<PaginatedResponse<DepositListItem>>(
      `${adminPath("/deposits", clientId)}${buildQuery(params)}`,
    ),

  get: (id: string, clientId?: string) =>
    request<{ item: DepositDetailItem }>(
      adminPath(`/deposits/${id}`, clientId),
    ),
};

export const transactionsApi = {
  list: (params: TransactionListParams = {}, clientId?: string) =>
    request<PaginatedResponse<TransactionListItem>>(
      `${adminPath("/transactions", clientId)}${buildQuery(params)}`,
    ),

  get: (id: string, clientId?: string) =>
    request<{ item: TransactionDetailItem }>(
      adminPath(`/transactions/${id}`, clientId),
    ),
};

export const settingsApi = {
  get: (clientId?: string) => overviewApi.dashboard(clientId),
};
