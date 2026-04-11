import type {
  BetterAuthSessionResponse,
  BetterAuthSignInResponse,
  BetterAuthUser,
} from "./types";
import { clearAuthToken, getAuthToken, setAuthToken } from "./token";

const AUTH_PREFIX = "/api/auth";

type NormalizedSession = { user: BetterAuthUser; token?: string } | null;

let inFlightSession: Promise<NormalizedSession> | null = null;
let lastSession:
  | {
      at: number;
      value: NormalizedSession;
    }
  | null = null;

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

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${AUTH_PREFIX}${normalizedPath}`, {
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
    // Dedupe bursts (React StrictMode dev double-invokes effects + login triggers refresh).
    // This keeps the backend from seeing 4-5 identical /get-session calls.
    if (lastSession && Date.now() - lastSession.at < 1500) {
      return lastSession.value;
    }
    if (inFlightSession) return inFlightSession;

    inFlightSession = (async () => {
    const raw = await authFetch<BetterAuthSessionResponse>(`/get-session`, {
      method: "GET",
    });

    // Newer shape: `{ user, session }` (your backend example).
    if ("user" in raw) {
      const token = raw.token ?? raw.session?.token;
      // Avoid emitting auth-change from a "read" call, otherwise AuthProvider
      // can spin in a refresh loop and trigger backend throttling (429).
      if (token) setAuthToken(token, { emit: false });
      return token ? { user: raw.user, token } : { user: raw.user };
    }

    // Older shape: `{ session: { user, token } }`.
    const session = raw.session ?? null;
    if (!session) return null;
    if (session.token) setAuthToken(session.token, { emit: false });
    return session.token
      ? { user: session.user, token: session.token }
      : { user: session.user };
    })()
      .then((value) => {
        lastSession = { at: Date.now(), value };
        return value;
      })
      .finally(() => {
        inFlightSession = null;
      });

    return inFlightSession;
  },
};
