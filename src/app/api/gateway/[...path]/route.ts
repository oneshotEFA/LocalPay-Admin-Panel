import { NextRequest, NextResponse } from "next/server";

function backendBaseUrl(): string {
  const raw =
    process.env.BACKEND_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

async function proxy(req: NextRequest, segments: string[]) {
  const upstreamPath = `/${segments.join("/")}`;
  const target = `${backendBaseUrl()}${upstreamPath}${req.nextUrl.search}`;

  const headers = new Headers();
  const auth = req.headers.get("authorization");
  if (auth) headers.set("Authorization", auth);
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const method = req.method;
  const hasBody = !["GET", "HEAD"].includes(method);
  const bodyBuffer = hasBody ? await req.arrayBuffer() : null;

  const upstream = await fetch(target, {
    method,
    headers,
    ...(bodyBuffer && bodyBuffer.byteLength > 0 ? { body: bodyBuffer } : {}),
    cache: "no-store",
  });

  const outHeaders = new Headers();
  const ct = upstream.headers.get("content-type");
  if (ct) outHeaders.set("Content-Type", ct);

  if (upstream.status === 204) {
    return new NextResponse(null, { status: 204, headers: outHeaders });
  }

  const buf = await upstream.arrayBuffer();
  return new NextResponse(buf, {
    status: upstream.status,
    headers: outHeaders,
  });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
