import type {
  BetterAuthSessionResponse,
  BetterAuthSignInResponse,
} from "./types";
import { clearAuthToken, getAuthToken, setAuthToken } from "./token";

const AUTH_PREFIX = "/api/auth/";

export class BetterAuthError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "BetterAuthError";
  }
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string };
    if (typeof body?.message === "string" && body.message.trim()) {
      return body.message;
    }
  } catch {}
  return `HTTP ${res.status}`;
}

async function authFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();

  const res = await fetch(`${AUTH_PREFIX}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) clearAuthToken();
    throw new BetterAuthError(res.status, await parseErrorMessage(res));
  }

  return (await res.json()) as T;
}

export const betterAuthClient = {
  async signInEmail(email: string, password: string) {
    const data = await authFetch<BetterAuthSignInResponse>(`/sign-in/email`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data?.token) setAuthToken(data.token);
    return data;
  },

  async signUpEmail(input: { email: string; password: string; name?: string }) {
    const data = await authFetch<BetterAuthSignInResponse>(`/sign-up/email`, {
      method: "POST",
      body: JSON.stringify(input),
    });
    if (data?.token) setAuthToken(data.token);
    return data;
  },

  async signOut() {
    const token = getAuthToken();
    try {
      await authFetch(`/sign-out`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });
    } catch {
      // Best-effort sign-out; always clear local token.
    } finally {
      clearAuthToken();
    }
  },

  async getSession() {
    const token = getAuthToken();
    const res = await authFetch<any>(`/get-session`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) {
      clearAuthToken();
      return null;
    }
    if (!res.ok) {
      throw new BetterAuthError(res.status, await parseErrorMessage(res));
    }
    const raw = (await res.json()) as BetterAuthSessionResponse;
    console.log("RAW SESSION DATA:", raw);
    if ("user" in raw) return { user: raw.user, token: raw.token };
    const session = raw.session ?? null;
    return session ? { user: session.user, token: session.token } : null;
  },
};
