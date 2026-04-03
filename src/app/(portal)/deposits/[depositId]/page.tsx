"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { VerificationCheck } from "@/lib/types";
import { useDeposit } from "@/lib/api";
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
  FileText,
  Link2,
  MessageSquare,
  Camera,
  AlertTriangle,
  Hash,
  RefreshCcw,
  Calendar,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDt = (s: string) => format(new Date(s), "MMM d, yyyy HH:mm:ss");

const CHECK_LABELS: Record<VerificationCheck, string> = {
  [VerificationCheck.AMOUNT_MATCH]: "Amount Match",
  [VerificationCheck.TIMESTAMP_FRESHNESS]: "Timestamp Freshness",
  [VerificationCheck.TRANSACTION_ID_FORMAT]: "TX ID Format",
  [VerificationCheck.DUPLICATE_CHECK]: "Duplicate Check",
  [VerificationCheck.RECEIVER_ACCOUNT_MATCH]: "Receiver Account",
};

const InfoRow = ({
  label,
  value,
  isId,
}: {
  label: string;
  value: string | number;
  isId?: boolean;
}) => (
  <div className="flex items-center justify-between py-2.5">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span
      className={cn(
        "text-sm font-medium",
        isId && "font-mono text-xs bg-muted px-1.5 py-0.5 rounded",
      )}
    >
      {value || "—"}
    </span>
  </div>
);

export default function DepositDetailPage({
  params,
}: {
  params: Promise<{ depositId: string }>;
}) {
  const { depositId } = use(params);
  const { data: dep, error, refetch, isPending } = useDeposit(depositId);

  if (isPending && !dep) return <DetailPageSkeleton />;
  if (error && !dep)
    return (
      <QueryError title="Couldn’t load deposit" onRetry={() => refetch()} />
    );
  if (!dep) return null;

  const getStatusStyles = (status: string) => {
    if (status === "FUNDED")
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    if (status === "VERIFIED")
      return "bg-teal-500/10 text-teal-600 border-teal-500/20";
    if (status.includes("REJECTED"))
      return "bg-red-500/10 text-red-600 border-red-500/20";
    return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  };

  const receiptIcon =
    dep.receipt?.type === "SMS" ? (
      <MessageSquare className="h-4 w-4" />
    ) : dep.receipt?.type === "LINK" ? (
      <Link2 className="h-4 w-4" />
    ) : (
      <Camera className="h-4 w-4" />
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <BackLink href="/deposits">Back to deposits</BackLink>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Deposit Details
            </h1>
            <Badge
              variant="outline"
              className={cn(
                "px-2.5 py-0.5 rounded-full capitalize",
                getStatusStyles(dep.status),
              )}
            >
              {dep.status.replace(/_/g, " ").toLowerCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md">
              {dep.id}
            </span>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4 flex items-center gap-6 shadow-sm">
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Deposit Amount
            </p>
            <p className="text-2xl font-black text-primary">
              {fmt(dep.amount)}
            </p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Method
            </p>
            <p className="text-sm font-bold text-foreground">
              {dep.paymentMethod}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Summary & History */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                Transaction Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-border/50">
              <div className="grid md:grid-cols-2 gap-x-12">
                <div>
                  <InfoRow
                    label="Checkout ID"
                    value={dep.checkout?.id ?? "Direct"}
                    isId
                  />
                  <InfoRow
                    label="Retry Status"
                    value={`${dep.retryCount} of ${dep.maxRetries} attempts`}
                  />
                </div>
                <div>
                  <InfoRow label="Created" value={fmtDt(dep.createdAt)} />
                  <InfoRow label="Last Update" value={fmtDt(dep.updatedAt)} />
                </div>
              </div>

              {dep.rejectionReason && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-red-900">
                      Rejection: {dep.reasonCode || "Verification Failed"}
                    </p>
                    <p className="text-sm text-red-700 mt-0.5">
                      {dep.rejectionReason}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Timeline */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Verification Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {dep.verifications?.map((v) => (
                  <div
                    key={v.id}
                    className={cn(
                      "relative overflow-hidden p-4 rounded-xl border transition-all",
                      v.passed
                        ? "bg-emerald-50/30 border-emerald-100"
                        : "bg-red-50/30 border-red-100",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {v.passed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {CHECK_LABELS[v.check] ?? v.check}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {v.detail || "System check completed"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Crawl Result */}
          {dep.crawlResult && (
            <Card className="border-primary/20 bg-primary/2">
              <CardHeader className="pb-3 border-b border-primary/10">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4 text-primary animate-spin-slow" />
                  Network Confirmation (Crawl)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid sm:grid-cols-2 gap-x-12">
                <div className="divide-y divide-primary/5">
                  <InfoRow
                    label="Network TXID"
                    value={dep.crawlResult.transactionId}
                    isId
                  />
                  <InfoRow
                    label="Confirmed Amt"
                    value={
                      dep.crawlResult.confirmedAmount != null
                        ? fmt(dep.crawlResult.confirmedAmount)
                        : "Pending"
                    }
                  />
                </div>
                <div className="divide-y divide-primary/5">
                  <InfoRow
                    label="Receiver"
                    value={dep.crawlResult.confirmedReceiverName ?? "-"}
                  />
                  <InfoRow
                    label="Crawled At"
                    value={fmtDt(dep.crawlResult.crawledAt)}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar: Receipt Data */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {receiptIcon}
                Proof of Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {dep.receipt ? (
                <>
                  <div className="divide-y divide-border/50">
                    <InfoRow label="Submission" value={dep.receipt.type} />
                    <InfoRow
                      label="Extracted ID"
                      value={dep.receipt.extractedTransactionId ?? "—"}
                      isId
                    />
                  </div>

                  {dep.receipt.rawSmsText && (
                    <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Source Message
                      </p>
                      <p className="text-xs font-mono text-slate-300 leading-relaxed italic">
                        "{dep.receipt.rawSmsText}"
                      </p>
                    </div>
                  )}

                  {dep.receipt.rawLinkUrl && (
                    <a
                      href={dep.receipt.rawLinkUrl}
                      target="_blank"
                      className="flex items-center justify-between p-3 rounded-lg bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-colors"
                    >
                      View Attached Receipt <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </>
              ) : (
                <div className="py-8 text-center">
                  <Camera className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No receipt data found
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-muted/20 border-dashed">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Internal Note</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This deposit is processed automatically. If the verification
                    fails, the system will allow up to {dep.maxRetries} retries
                    before final rejection.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
