import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!; // http://localhost:3000

type RouteContext = {
  params: { path: string[] } | Promise<{ path: string[] }>;
};

function getSetCookieHeaders(res: Response): string[] {
  const headersAny = res.headers as unknown as {
    getSetCookie?: () => string[];
  };
  if (typeof headersAny.getSetCookie === "function") {
    return headersAny.getSetCookie();
  }
  const single = res.headers.get("set-cookie");
  return single ? [single] : [];
}

async function proxy(req: NextRequest, path: string[]) {
  const target = `${BACKEND}/auth/${path.join("/")}${req.nextUrl.search}`;

  console.log(`Proxying request to auth backend: ${req.method} to ${target}`);

  const headers = new Headers();

  const auth = req.headers.get("authorization");
  if (auth) headers.set("Authorization", auth);

  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const cookie = req.headers.get("cookie");
  if (cookie) headers.set("Cookie", cookie);

  const userAgent = req.headers.get("user-agent");
  if (userAgent) headers.set("User-Agent", userAgent);

  const accept = req.headers.get("accept");
  if (accept) headers.set("Accept", accept);

  const origin = req.headers.get("origin");
  if (origin) headers.set("Origin", origin);
  
  const acceptLanguage = req.headers.get("accept-language");
  if (acceptLanguage) headers.set("Accept-Language", acceptLanguage);

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.arrayBuffer()
      : null;

  const res = await fetch(target, {
    method: req.method,
    headers,
    body,
  });
  const cloned = res.clone();
  const out = new NextResponse(await res.arrayBuffer(), {
    status: res.status,
  });

  // try {
  //   const data = await cloned.json();
  //   console.log("🔍 BACKEND RESPONSE:", data);
  // } catch {
  //   console.log("⚠️ Response is not JSON");
  // }
  // Preserve content type for proper parsing on the client.
  const outContentType = res.headers.get("content-type");
  if (outContentType) out.headers.set("Content-Type", outContentType);

  // Critical: forward Set-Cookie so the browser stores the session token.
  for (const cookieHeader of getSetCookieHeaders(res)) {
    out.headers.append("Set-Cookie", cookieHeader);
  }

  return out;
}

async function getParamsPath(ctx: RouteContext): Promise<string[]> {
  const params = await Promise.resolve(ctx.params);
  return params.path;
}

export async function GET(req: NextRequest, ctx: RouteContext) {
  return proxy(req, await getParamsPath(ctx));
}
export async function POST(req: NextRequest, ctx: RouteContext) {
  return proxy(req, await getParamsPath(ctx));
}
export async function PATCH(req: NextRequest, ctx: RouteContext) {
  return proxy(req, await getParamsPath(ctx));
}
export async function DELETE(req: NextRequest, ctx: RouteContext) {
  return proxy(req, await getParamsPath(ctx));
}
