"use client";

import type { ElementType } from "react";
import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CheckoutStatus } from "@/lib/types";
import { useCheckout } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailPageSkeleton } from "@/components/shared/skeletons";
import { QueryError } from "@/components/shared/QueryError";
import { BackLink } from "@/components/shared/BackLink";
import { CheckCircle2, XCircle, Clock, Zap, User, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

const fmtAmt = (n: number) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(n);
const fmtDt = (s: string) => format(new Date(s), "MMM d, yyyy HH:mm:ss");

const STATUS_META: Record<
  CheckoutStatus,
  { label: string; cls: string; icon: ElementType }
> = {
  [CheckoutStatus.PAID]: {
    label: "Paid",
    cls: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  [CheckoutStatus.PENDING]: {
    label: "Pending",
    cls: "bg-amber-500/12 text-amber-800 dark:text-amber-400 border-amber-500/20",
    icon: Clock,
  },
  [CheckoutStatus.FAILED]: {
    label: "Failed",
    cls: "bg-destructive/12 text-destructive border-destructive/20",
    icon: XCircle,
  },
  [CheckoutStatus.EXPIRED]: {
    label: "Expired",
    cls: "bg-destructive/12 text-destructive border-destructive/20",
    icon: XCircle,
  },
  [CheckoutStatus.CANCELLED]: {
    label: "Cancelled",
    cls: "bg-muted text-muted-foreground border-border",
    icon: XCircle,
  },
};

export default function CheckoutDetailPage({ params }: { params: Promise<{ checkoutId: string }> }) {
  const { checkoutId } = use(params);
  const { data: chk, error, refetch, isPending } = useCheckout(checkoutId);

  if (isPending && !chk) return <DetailPageSkeleton />;
  if (error && !chk) {
    return (
      <QueryError
        title="Couldn’t load checkout"
        message="This session could not be retrieved. Try again."
        onRetry={() => refetch()}
      />
    );
  }
  if (!chk) return null;

  const meta = STATUS_META[chk.status];
  const Icon = meta.icon;

  const detailRowClass =
    "flex items-start justify-between gap-4 text-sm";
  const labelClass = "flex-shrink-0 text-muted-foreground";
  const valueClass = "text-right font-mono text-xs text-foreground";

  return (
    <div className="max-w-4xl space-y-8 pb-10 animate-in fade-in duration-300">
      <BackLink href="/checkouts">Back to checkouts</BackLink>
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Checkout session
          </p>
          <h1 className="mt-1 break-all font-mono text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {chk.id}
          </h1>
        </div>
        <Badge
          variant="outline"
          className={cn("gap-1.5 border font-medium shadow-none", meta.cls)}
        >
          <Icon className="h-3.5 w-3.5" />
          {meta.label}
        </Badge>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="rounded-2xl border-border/80 shadow-sm">
          <CardHeader className="border-b border-border/80 bg-muted/20 pb-3">
            <CardTitle className="text-sm font-semibold">Payment details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {[
              ["Invoice ID", chk.invoiceId],
              ["Product", chk.productName],
              ["Amount", fmtAmt(chk.amount)],
              ["Created", fmtDt(chk.createdAt)],
              ["Expires", fmtDt(chk.expiresAt)],
              ["TX ID", chk.transactionId ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className={detailRowClass}>
                <span className={labelClass}>{k}</span>
                <span className={valueClass}>{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-sm">
          <CardHeader className="border-b border-border/80 bg-muted/20 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <User className="h-4 w-4 text-muted-foreground" />
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {[
              ["Name", chk.customerName],
              ["Email", chk.customerEmail],
              ["User ID", chk.userId ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className={detailRowClass}>
                <span className={labelClass}>{k}</span>
                <span className={valueClass}>{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-sm">
          <CardHeader className="border-b border-border/80 bg-muted/20 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Zap className="h-4 w-4 text-muted-foreground" />
              Webhook
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3 text-sm">
              <div className={detailRowClass}>
                <span className={labelClass}>URL</span>
                <a
                  href={chk.webhookUrl}
                  className="max-w-[200px] truncate text-right text-xs font-mono text-primary hover:underline"
                >
                  {chk.webhookUrl}
                </a>
              </div>
              <div className={detailRowClass}>
                <span className={labelClass}>Fired at</span>
                <span className={valueClass}>
                  {chk.webhookFiredAt ? fmtDt(chk.webhookFiredAt) : "—"}
                </span>
              </div>
              {chk.webhookResponse ? (
                <div className="mt-2 rounded-xl border border-border/80 bg-muted/30 p-3">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    Response payload
                  </p>
                  <pre className="overflow-x-auto font-mono text-xs text-foreground">
                    {JSON.stringify(
                      typeof chk.webhookResponse === "string"
                        ? JSON.parse(chk.webhookResponse)
                        : chk.webhookResponse,
                      null,
                      2,
                    )}
                  </pre>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-sm">
          <CardHeader className="border-b border-border/80 bg-muted/20 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              Redirect URLs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {[
              ["Success", chk.successUrl],
              ["Cancel", chk.cancelUrl],
              ["Failed", chk.failedUrl],
            ].map(([k, v]) => (
              <div key={k} className={detailRowClass}>
                <span className={labelClass}>{k}</span>
                <a
                  href={v}
                  className="max-w-[200px] truncate text-right text-xs font-mono text-primary hover:underline"
                >
                  {v}
                </a>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {chk.deposit ? (
        <Card className="rounded-2xl border-border/80 shadow-sm">
          <CardHeader className="border-b border-border/80 bg-muted/20 pb-3">
            <CardTitle className="text-sm font-semibold">Linked deposit</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Link
              href={`/deposits/${chk.deposit.id}`}
              className="inline-flex items-center gap-2 font-mono text-sm font-medium text-primary hover:underline"
            >
              {chk.deposit.id}
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
