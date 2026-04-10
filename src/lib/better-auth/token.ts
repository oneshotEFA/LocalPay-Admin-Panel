const AUTH_TOKEN_COOKIE = "localpay_auth_token";
const AUTH_CHANGED_EVENT = "localpay-auth-changed";

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function parseCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const value = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  if (!value) return null;
  const raw = value.slice(name.length + 1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function getAuthToken(): string | null {
  return parseCookie(AUTH_TOKEN_COOKIE);
}

export function setAuthToken(token: string) {
  if (!isBrowser()) return;
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(
    token,
  )}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearAuthToken() {
  if (!isBrowser()) return;
  document.cookie = `${AUTH_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function onAuthChanged(cb: () => void) {
  if (!isBrowser()) return () => {};
  const handler = () => cb();
  window.addEventListener(AUTH_CHANGED_EVENT, handler);
  return () => window.removeEventListener(AUTH_CHANGED_EVENT, handler);
}

