"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CheckoutStatus } from "@/lib/types";
import { useCheckout } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, CheckCircle2, XCircle, Clock, Zap, User, Link2 } from "lucide-react";

const fmtAmt = (n: number) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(n);
const fmtDt = (s: string) => format(new Date(s), "MMM d, yyyy HH:mm:ss");

const STATUS_META: Record<CheckoutStatus, { label: string; cls: string; icon: React.ElementType }> = {
  [CheckoutStatus.PAID]: { label: "Paid", cls: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  [CheckoutStatus.PENDING]: { label: "Pending", cls: "bg-amber-100  text-amber-700  border-amber-200", icon: Clock },
  [CheckoutStatus.FAILED]: { label: "Failed", cls: "bg-rose-100   text-rose-700   border-rose-200", icon: XCircle },
  [CheckoutStatus.EXPIRED]: { label: "Expired", cls: "bg-rose-100   text-rose-700   border-rose-200", icon: XCircle },
  [CheckoutStatus.CANCELLED]: { label: "Cancelled", cls: "bg-slate-100  text-slate-600  border-slate-200", icon: XCircle },
};

export default function CheckoutDetailPage({ params }: { params: Promise<{ checkoutId: string }> }) {
  const { checkoutId } = use(params);
  const { data: chk, isLoading, error } = useCheckout(checkoutId);

  if (isLoading) return <div className="text-sm text-slate-500">Loading checkout...</div>;
  if (error || !chk) return <div className="text-sm text-rose-600">Failed to load checkout.</div>;

  const meta = STATUS_META[chk.status];
  const Icon = meta.icon;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <Link href="/checkouts" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors">
          <ChevronLeft className="h-4 w-4" />Checkouts
        </Link>
        <div className="flex items-start gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight font-mono">{chk.id}</h1>
            <p className="text-sm text-slate-500 mt-0.5">Checkout Session</p>
          </div>
          <div className="mt-1">
            <Badge className={`shadow-none gap-1 ${meta.cls}`}><Icon className="w-3.5 h-3.5" />{meta.label}</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800">Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {[
              ["Invoice ID", chk.invoiceId],
              ["Product", chk.productName],
              ["Amount", fmtAmt(chk.amount)],
              ["Created", fmtDt(chk.createdAt)],
              ["Expires", fmtDt(chk.expiresAt)],
              ["TX ID", chk.transactionId ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-4 text-sm">
                <span className="text-slate-500 flex-shrink-0">{k}</span>
                <span className="text-slate-900 font-mono text-xs text-right">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <User className="h-4 w-4" />Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {[
              ["Name", chk.customerName],
              ["Email", chk.customerEmail],
              ["User ID", chk.userId ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-4 text-sm">
                <span className="text-slate-500">{k}</span>
                <span className="text-slate-900 font-mono text-xs text-right">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Zap className="h-4 w-4" />Webhook
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="text-sm space-y-3">
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500 flex-shrink-0">URL</span>
                <a href={chk.webhookUrl} className="text-blue-600 text-xs font-mono hover:underline truncate max-w-[180px]">{chk.webhookUrl}</a>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-500">Fired At</span>
                <span className="text-slate-900 text-xs font-mono text-right">{chk.webhookFiredAt ? fmtDt(chk.webhookFiredAt) : "—"}</span>
              </div>
              {chk.webhookResponse && (
                <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium mb-1">Response Payload</p>
                  <pre className="text-xs font-mono text-slate-700 overflow-x-auto">{JSON.stringify(typeof chk.webhookResponse === "string" ? JSON.parse(chk.webhookResponse) : chk.webhookResponse, null, 2)}</pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Link2 className="h-4 w-4" />Redirect URLs
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {[["Success", chk.successUrl], ["Cancel", chk.cancelUrl], ["Failed", chk.failedUrl]].map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-4 text-sm">
                <span className="text-slate-500 flex-shrink-0">{k}</span>
                <a href={v} className="text-blue-600 text-xs font-mono hover:underline truncate max-w-[180px]">{v}</a>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {chk.deposit && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800">Linked Deposit</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Link href={`/deposits/${chk.deposit.id}`} className="inline-flex items-center gap-2 text-sm font-mono text-blue-600 hover:text-blue-700 hover:underline">
              {chk.deposit.id}
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
