"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useTransaction } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailPageSkeleton } from "@/components/shared/skeletons";
import { QueryError } from "@/components/shared/QueryError";
import { BackLink } from "@/components/shared/BackLink";
import { CheckCircle2, XCircle } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(n);

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactionId } = use(params);
  const { data: txn, error, refetch, isPending } = useTransaction(transactionId);

  if (isPending && !txn) return <DetailPageSkeleton />;
  if (error && !txn) {
    return (
      <QueryError
        title="Couldn’t load transaction"
        message="This record could not be retrieved. Try again."
        onRetry={() => refetch()}
      />
    );
  }
  if (!txn) return null;

  const success =
    (txn.platformResponse as { success?: boolean })?.success === true;

  const row =
    "flex items-start justify-between gap-4 text-sm";
  const lbl = "flex-shrink-0 text-muted-foreground";
  const val = "text-right font-mono text-xs text-foreground";

  return (
    <div className="max-w-3xl space-y-8 pb-10 animate-in fade-in duration-300">
      <BackLink href="/transactions">Back to transactions</BackLink>
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Funded transaction
          </p>
          <h1 className="mt-1 break-all font-mono text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {txn.id}
          </h1>
        </div>
        <div className="shrink-0">
          {success ? (
            <Badge
              variant="outline"
              className="gap-1 border-emerald-500/25 bg-emerald-500/10 font-medium text-emerald-700 shadow-none dark:text-emerald-400"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Success
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="gap-1 border-destructive/25 bg-destructive/10 font-medium text-destructive shadow-none"
            >
              <XCircle className="h-3.5 w-3.5" />
              Error
            </Badge>
          )}
        </div>
      </div>

      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/80 bg-muted/20 pb-3">
          <CardTitle className="text-sm font-semibold">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {[
            ["Funded amount", fmt(txn.fundedAmount)],
            ["Platform user ID", txn.platformUserId],
            ["Deposit request ID", txn.depositRequestId],
            [
              "Funded at",
              format(new Date(txn.fundedAt), "MMM d, yyyy HH:mm:ss"),
            ],
          ].map(([k, v]) => (
            <div key={k} className={row}>
              <span className={lbl}>{k}</span>
              <span className={val}>{v}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/80 bg-muted/20 pb-3">
          <CardTitle className="text-sm font-semibold">
            Platform response
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <pre className="overflow-x-auto rounded-xl border border-border/80 bg-muted/30 p-4 font-mono text-xs text-foreground">
            {JSON.stringify(txn.platformResponse, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <Link
        href={`/deposits/${txn.depositRequestId}`}
        className="inline-flex text-sm font-medium text-primary hover:underline"
      >
        Open linked deposit →
      </Link>
    </div>
  );
}
