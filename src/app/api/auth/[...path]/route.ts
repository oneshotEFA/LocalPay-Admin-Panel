import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!; // http://localhost:3000
async function proxy(req: NextRequest, path: string[]) {
  const target = `${BACKEND}/auth/${path.join("/")}${req.nextUrl.search}`;

  console.log(`Proxying request to auth backend: ${req.method} to ${target}`);

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
  const cloned = res.clone();

  try {
    const data = await cloned.json();
    console.log("🔍 BACKEND RESPONSE:", data);
  } catch {
    console.log("⚠️ Response is not JSON");
  }

  return new NextResponse(await res.arrayBuffer(), {
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
