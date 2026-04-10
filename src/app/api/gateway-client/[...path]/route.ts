import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

async function proxy(req: NextRequest, path: string[]) {
  const target = `${BACKEND}/api/gateway-client/${path.join("/")}${req.nextUrl.search}`;

  const headers = new Headers();
  const auth = req.headers.get("authorization");
  if (auth) headers.set("Authorization", auth);

  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

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

export async function GET(req: NextRequest, ctx: any) {
  return proxy(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: any) {
  return proxy(req, (await ctx.params).path);
}
export async function PATCH(req: NextRequest, ctx: any) {
  return proxy(req, (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: any) {
  return proxy(req, (await ctx.params).path);
}
