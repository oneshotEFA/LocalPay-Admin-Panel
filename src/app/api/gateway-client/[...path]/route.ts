import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

type RouteContext = {
  params: { path: string[] } | Promise<{ path: string[] }>;
};

async function proxy(req: NextRequest, path: string[]) {
  const target = `${BACKEND}/gateway-client/${path.join("/")}${req.nextUrl.search}`;
  console.log(
    `Proxying request to gateway client backend: ${req.method} to ${target}`,
  );
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
  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.arrayBuffer()
      : null;

  const res = await fetch(target, {
    method: req.method,
    headers,
    body,
  });

  const buf = await res.arrayBuffer();

  return new NextResponse(buf, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/json",
    },
  });
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
