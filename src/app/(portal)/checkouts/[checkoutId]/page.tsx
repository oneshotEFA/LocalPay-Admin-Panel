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
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  User,
  Link2,
  CreditCard,
  Receipt,
  Calendar,
  Hash,
  Mail,
  Globe,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
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
  { label: string; color: string; icon: ElementType }
> = {
  [CheckoutStatus.PAID]: {
    label: "Paid",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    icon: CheckCircle2,
  },
  [CheckoutStatus.PENDING]: {
    label: "Pending",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    icon: Clock,
  },
  [CheckoutStatus.FAILED]: {
    label: "Failed",
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    icon: XCircle,
  },
  [CheckoutStatus.EXPIRED]: {
    label: "Expired",
    color: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    icon: AlertCircle,
  },
  [CheckoutStatus.CANCELLED]: {
    label: "Cancelled",
    color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    icon: XCircle,
  },
};

const InfoRow = ({
  label,
  value,
  href,
  isId,
}: {
  label: string;
  value: string | number;
  href?: string;
  isId?: boolean;
}) => (
  <div className="flex items-center justify-between py-3 group">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors"
        >
          {value} <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span
          className={cn(
            "text-sm font-semibold text-foreground",
            isId && "font-mono text-xs bg-muted px-1.5 py-0.5 rounded",
          )}
        >
          {value || "—"}
        </span>
      )}
    </div>
  </div>
);

export default function CheckoutDetailPage({
  params,
}: {
  params: Promise<{ checkoutId: string }>;
}) {
  const { checkoutId } = use(params);
  const { data: chk, error, refetch, isPending } = useCheckout(checkoutId);

  if (isPending && !chk) return <DetailPageSkeleton />;
  if (error && !chk)
    return (
      <QueryError title="Couldn’t load checkout" onRetry={() => refetch()} />
    );
  if (!chk) return null;

  const meta = STATUS_META[chk.status];
  const StatusIcon = meta.icon;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <BackLink href="/checkouts">Back to checkouts</BackLink>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {chk.productName}
            </h1>
            <Badge
              variant="outline"
              className={cn(
                "capitalize px-2.5 py-0.5 rounded-full",
                meta.color,
              )}
            >
              <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
              {meta.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md">
              {chk.id}
            </span>
            <button className="hover:text-foreground transition-colors">
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4 flex items-center gap-6 shadow-sm">
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Total Amount
            </p>
            <p className="text-2xl font-black text-primary">
              {fmtAmt(chk.amount)}
            </p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="bg-primary/5 p-3 rounded-full">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                Transaction Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-x-8">
                <div className="divide-y divide-border/50">
                  <InfoRow label="Invoice ID" value={chk.invoiceId} isId />
                  <InfoRow label="Created At" value={fmtDt(chk.createdAt)} />
                  <InfoRow label="Expires At" value={fmtDt(chk.expiresAt)} />
                </div>
                <div className="divide-y divide-border/50">
                  <InfoRow
                    label="Transaction ID"
                    value={chk.transactionId ?? "Not available"}
                    isId
                  />
                  <InfoRow
                    label="User Reference"
                    value={chk.userId ?? "Guest"}
                  />
                  {chk.deposit && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-sm text-muted-foreground">
                        Linked Deposit
                      </span>
                      <Link
                        href={`/deposits/${chk.deposit.id}`}
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        View <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-600">
                <Zap className="h-4 w-4" />
                Webhook & Automation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-8 divide-x">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Endpoint URL
                  </p>
                  <p className="text-sm font-mono break-all text-blue-600">
                    {chk.webhookUrl}
                  </p>
                </div>
                <div className="pl-0 md:pl-8 space-y-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Delivery Status
                  </p>
                  <p className="text-sm font-medium">
                    {chk.webhookFiredAt
                      ? `Fired on ${fmtDt(chk.webhookFiredAt)}`
                      : "Pending Event"}
                  </p>
                </div>
              </div>

              {chk.webhookResponse && (
                <div className="rounded-xl border bg-slate-950 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                      Server Response
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-slate-700 text-slate-300"
                    >
                      JSON
                    </Badge>
                  </div>
                  <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48 custom-scrollbar">
                    {JSON.stringify(
                      typeof chk.webhookResponse === "string"
                        ? JSON.parse(chk.webhookResponse)
                        : chk.webhookResponse,
                      null,
                      2,
                    )}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-lg font-bold">{chk.customerName}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> {chk.customerEmail}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Link2 className="h-4 w-4 text-primary" />
                Redirect Flows
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/50">
              <InfoRow
                label="Success"
                value="Redirect URL"
                href={chk.successUrl}
              />
              <InfoRow
                label="Cancel"
                value="Redirect URL"
                href={chk.cancelUrl}
              />
              <InfoRow
                label="Failure"
                value="Redirect URL"
                href={chk.failedUrl}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
