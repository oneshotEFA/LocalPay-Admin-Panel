/**
 * HabeshaUnlocker Portal — Centralized API Client
 * All requests go through here. Connect your NestJS backend by setting NEXT_PUBLIC_API_URL.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
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

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export const authApi = {
  /** POST /auth/login — returns session cookie */
  login: (body: { email: string; password: string }) =>
    request<{ user: { id: string; email: string; name: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /** POST /auth/logout — clears session */
  logout: () =>
    request<void>("/auth/logout", { method: "POST" }),

  /** GET /auth/me — current session user */
  me: () =>
    request<{ id: string; email: string; name: string; clientId: string }>("/auth/me"),

  /** POST /auth/refresh — refresh JWT access token */
  refresh: () =>
    request<{ accessToken: string }>("/auth/refresh", { method: "POST" }),
};

// ─── Overview / Stats ────────────────────────────────────────────────────────

export interface OverviewStats {
  totalCheckoutsMonth: number;
  totalDepositsMonth: number;
  totalFundedMonth: number;
  pendingAttention: number;
  successRatePercent: number;
}

export const overviewApi = {
  /** GET /portal/stats — monthly summary stats */
  stats: () => request<OverviewStats>("/portal/stats"),
};

// ─── Checkouts ───────────────────────────────────────────────────────────────

export interface CheckoutListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  from?: string;
  to?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const checkoutsApi = {
  /** GET /portal/checkouts — paginated list */
  list: (params: CheckoutListParams = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
    return request<PaginatedResponse<import("../types").GatewayCheckout>>(
      `/portal/checkouts?${q}`
    );
  },

  /** GET /portal/checkouts/:id — single checkout with deposit relation */
  get: (id: string) =>
    request<import("../types").GatewayCheckout>(`/portal/checkouts/${id}`),
};

// ─── Deposits ────────────────────────────────────────────────────────────────

export interface DepositListParams {
  page?: number;
  limit?: number;
  status?: string;
  paymentMethod?: string;
  search?: string;
  checkoutId?: string;
}

export const depositsApi = {
  /** GET /portal/deposits — paginated list */
  list: (params: DepositListParams = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
    return request<PaginatedResponse<import("../types").DepositRequest>>(
      `/portal/deposits?${q}`
    );
  },

  /** GET /portal/deposits/:id — single deposit with receipt, crawl, verifications */
  get: (id: string) =>
    request<import("../types").DepositRequest>(`/portal/deposits/${id}`),
};

// ─── Transactions ────────────────────────────────────────────────────────────

export interface TransactionListParams {
  page?: number;
  limit?: number;
  search?: string;
  from?: string;
  to?: string;
}

export const transactionsApi = {
  /** GET /portal/transactions — paginated list of funded transactions */
  list: (params: TransactionListParams = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
    return request<PaginatedResponse<import("../types").Transaction>>(
      `/portal/transactions?${q}`
    );
  },

  /** GET /portal/transactions/:id */
  get: (id: string) =>
    request<import("../types").Transaction>(`/portal/transactions/${id}`),
};

// ─── Receiving Accounts ──────────────────────────────────────────────────────

export interface UpsertAccountBody {
  paymentMethod: string;
  accountName: string;
  accountNumber: string;
  isActive?: boolean;
}

export const accountsApi = {
  /** GET /portal/accounts — all receiving accounts for this client */
  list: () =>
    request<import("../types").ClientReceivingAccount[]>("/portal/accounts"),

  /** POST /portal/accounts — create new receiving account */
  create: (body: UpsertAccountBody) =>
    request<import("../types").ClientReceivingAccount>("/portal/accounts", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /** PATCH /portal/accounts/:id — update account name/number */
  update: (id: string, body: Partial<UpsertAccountBody>) =>
    request<import("../types").ClientReceivingAccount>(`/portal/accounts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  /** PATCH /portal/accounts/:id/toggle — toggle isActive */
  toggle: (id: string) =>
    request<import("../types").ClientReceivingAccount>(`/portal/accounts/${id}/toggle`, {
      method: "PATCH",
    }),
};

// ─── API Keys ─────────────────────────────────────────────────────────────────

export interface CreateApiKeyBody {
  label: string;
}

export interface CreatedApiKeyResponse extends import("../types").GatewayApiKey {
  /** Only returned once on creation */
  apiSecret: string;
}

export const apiKeysApi = {
  /** GET /portal/api-keys — list all keys (secrets masked) */
  list: () =>
    request<import("../types").GatewayApiKey[]>("/portal/api-keys"),

  /** POST /portal/api-keys — generate new key pair */
  create: (body: CreateApiKeyBody) =>
    request<CreatedApiKeyResponse>("/portal/api-keys", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /** DELETE /portal/api-keys/:id — revoke key */
  revoke: (id: string) =>
    request<void>(`/portal/api-keys/${id}`, { method: "DELETE" }),
};

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface ClientProfileResponse {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  webhookUrl: string | null;
  isActive: boolean;
}

export interface UpdateWebhookBody {
  webhookUrl: string;
}

export interface UpdateBrandingBody {
  name?: string;
  logoUrl?: string;
  theme?: "light" | "dark";
}

export interface NotificationSettingsBody {
  depositVerification?: boolean;
  depositVerificationChannel?: "email" | "webhook" | "sms";
  fundedTransaction?: boolean;
  receiptFailure?: boolean;
}

export const settingsApi = {
  /** GET /portal/settings — client profile + config */
  get: () =>
    request<ClientProfileResponse & { adminConfig: import("../types").AdminConfig[] }>(
      "/portal/settings"
    ),

  /** PATCH /portal/settings/webhook — update webhook URL */
  updateWebhook: (body: UpdateWebhookBody) =>
    request<ClientProfileResponse>("/portal/settings/webhook", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  /** PATCH /portal/settings/branding — update name/logo/theme */
  updateBranding: (body: UpdateBrandingBody) =>
    request<ClientProfileResponse>("/portal/settings/branding", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  /** PATCH /portal/settings/notifications — update notification routing */
  updateNotifications: (body: NotificationSettingsBody) =>
    request<void>("/portal/settings/notifications", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  /** POST /portal/settings/webhook/test — fire a test ping to webhook URL */
  testWebhook: () =>
    request<{ status: number; latencyMs: number }>("/portal/settings/webhook/test", {
      method: "POST",
    }),
};
