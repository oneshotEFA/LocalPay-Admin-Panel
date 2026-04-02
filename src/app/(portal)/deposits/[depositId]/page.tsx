"use client";

import { use } from "react";
import { format } from "date-fns";
import { VerificationCheck } from "@/lib/types";
import { useDeposit } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailPageSkeleton } from "@/components/shared/skeletons";
import { QueryError } from "@/components/shared/QueryError";
import { BackLink } from "@/components/shared/BackLink";
import { CheckCircle2, XCircle, Clock, FileText, Link2, MessageSquare, Camera, AlertTriangle } from "lucide-react";
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

export default function DepositDetailPage({ params }: { params: Promise<{ depositId: string }> }) {
  const { depositId } = use(params);
  const { data: dep, error, refetch, isPending } = useDeposit(depositId);

  if (isPending && !dep) return <DetailPageSkeleton />;
  if (error && !dep) {
    return (
      <QueryError
        title="Couldn’t load deposit"
        message="This deposit could not be retrieved. Try again."
        onRetry={() => refetch()}
      />
    );
  }
  if (!dep) return null;

  const getStatusBadge = (status: string) => {
    if (status === "FUNDED")
      return (
        <Badge
          variant="outline"
          className="gap-1 border-emerald-500/25 bg-emerald-500/10 font-medium text-emerald-700 shadow-none dark:text-emerald-400"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Funded
        </Badge>
      );
    if (status === "VERIFIED")
      return (
        <Badge
          variant="outline"
          className="gap-1 border-teal-500/25 bg-teal-500/10 font-medium text-teal-800 shadow-none dark:text-teal-400"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Verified
        </Badge>
      );
    if (status.includes("REJECTED"))
      return (
        <Badge
          variant="outline"
          className="gap-1 border-destructive/25 bg-destructive/10 font-medium text-destructive shadow-none"
        >
          <XCircle className="h-3.5 w-3.5" />
          Rejected
        </Badge>
      );
    return (
      <Badge
        variant="outline"
        className="gap-1 border-primary/20 bg-primary/10 font-medium text-primary shadow-none"
      >
        <Clock className="h-3.5 w-3.5" />
        {status.replace(/_/g, " ")}
      </Badge>
    );
  };

  const receiptIcon = dep.receipt?.type === "SMS" ? <MessageSquare className="h-4 w-4" /> :
    dep.receipt?.type === "LINK" ? <Link2 className="h-4 w-4" /> : <Camera className="h-4 w-4" />;

  return (
    <div className="max-w-4xl space-y-8 pb-10 animate-in fade-in duration-300">
      <BackLink href="/deposits">Back to deposits</BackLink>
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Deposit request
          </p>
          <h1 className="mt-1 break-all font-mono text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {dep.id}
          </h1>
        </div>

        <div className="shrink-0">{getStatusBadge(dep.status)}</div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="rounded-2xl border-border/80 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/80 bg-muted/20">
            <CardTitle className="text-sm font-semibold text-foreground">Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {[
              ["Amount", fmt(dep.amount)],
              ["Method", dep.paymentMethod],
              ["Checkout", dep.checkout?.id ?? "—"],
              ["Retries", `${dep.retryCount} / ${dep.maxRetries}`],
              ["Created", fmtDt(dep.createdAt)],
              ["Updated", fmtDt(dep.updatedAt)],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-4 text-sm">
                <span className="text-muted-foreground flex-shrink-0">{k}</span>
                <span className="text-foreground font-medium text-right font-mono text-xs">{v}</span>
              </div>
            ))}
            {dep.rejectionReason && (
              <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <div className="flex items-center gap-1.5 text-rose-700 text-xs font-semibold mb-1">
                  <AlertTriangle className="h-3.5 w-3.5" />Rejection Reason
                </div>
                <p className="text-rose-800 text-xs">{dep.rejectionReason}</p>
                {dep.reasonCode && <code className="text-rose-600 text-[10px] font-mono">{dep.reasonCode}</code>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/80 bg-muted/20">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              {receiptIcon}Receipt
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {dep.receipt ? (
              <div className="space-y-3 text-sm">
                {[
                  ["Type", dep.receipt.type],
                  ["Submitted", fmtDt(dep.receipt.submittedAt)],
                  ["Extracted TX ID", dep.receipt.extractedTransactionId ?? "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-4">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="text-foreground font-mono text-xs text-right">{v}</span>
                  </div>
                ))}
                {dep.receipt.rawSmsText && (
                  <div className="mt-3 p-3 rounded-xl border border-border/80 bg-muted/30">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Raw SMS</p>
                    <p className="text-xs text-slate-700 font-mono leading-relaxed">{dep.receipt.rawSmsText}</p>
                  </div>
                )}
                {dep.receipt.rawLinkUrl && (
                  <a href={dep.receipt.rawLinkUrl} className="font-mono text-xs text-primary hover:underline">
                    {dep.receipt.rawLinkUrl}
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 text-slate-400 text-sm">No receipt submitted</div>
            )}
          </CardContent>
        </Card>

        {dep.crawlResult && (
          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/80 bg-muted/20">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />Crawl Result
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-sm">
              {[
                ["TX ID", dep.crawlResult.transactionId],
                ["Amount", dep.crawlResult.confirmedAmount != null ? fmt(dep.crawlResult.confirmedAmount) : "—"],
                ["Receiver", dep.crawlResult.confirmedReceiverName ?? "—"],
                ["Account", dep.crawlResult.confirmedReceiverAccount ?? "—"],
                ["Status", dep.crawlResult.confirmedStatus ?? "—"],
                ["Crawled At", fmtDt(dep.crawlResult.crawledAt)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-foreground font-mono text-xs text-right">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {dep.verifications && dep.verifications.length > 0 && (
          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/80 bg-muted/20">
              <CardTitle className="text-sm font-semibold text-foreground">Verification Checks</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {dep.verifications.map((v) => (
                <div key={v.id} className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border",
                  v.passed ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"
                )}>
                  {v.passed
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    : <XCircle className="h-4 w-4 text-rose-600 mt-0.5 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${v.passed ? "text-emerald-800" : "text-rose-800"}`}>
                      {CHECK_LABELS[v.check] ?? v.check}
                    </p>
                    {v.detail && <p className="text-xs text-slate-600 mt-0.5">{v.detail}</p>}
                    {v.reasonCode && <code className="text-[10px] font-mono text-muted-foreground mt-1 block">{v.reasonCode}</code>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
