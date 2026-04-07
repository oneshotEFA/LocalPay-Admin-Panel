"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useTransaction } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/separator";
import { DetailPageSkeleton } from "@/components/shared/skeletons";
import { QueryError } from "@/components/shared/QueryError";
import { BackLink } from "@/components/shared/BackLink";
import {
  CheckCircle2,
  XCircle,
  Cpu,
  ArrowUpRight,
  Calendar,
  User as UserIcon,
  Layers,
  Code2,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDt = (s: string) => format(new Date(s), "MMM d, yyyy HH:mm:ss");

const InfoRow = ({
  label,
  value,
  isId,
}: {
  label: string;
  value: string | number;
  isId?: boolean;
}) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span
      className={cn(
        "text-sm font-medium text-foreground",
        isId && "font-mono text-xs bg-muted px-1.5 py-0.5 rounded",
      )}
    >
      {value || "—"}
    </span>
  </div>
);

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactionId } = use(params);
  const {
    data: txn,
    error,
    refetch,
    isPending,
  } = useTransaction(transactionId);

  if (isPending && !txn) return <DetailPageSkeleton />;
  if (error && !txn)
    return (
      <QueryError title="Couldn’t load transaction" onRetry={() => refetch()} />
    );
  if (!txn) return null;

  const isSuccess =
    (txn.platformResponse as { success?: boolean })?.success === true;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <BackLink href="/transactions">Back to transactions</BackLink>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Transaction Record
            </h1>
            <Badge
              variant="outline"
              className={cn(
                "px-2.5 py-0.5 rounded-full",
                isSuccess
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-red-500/10 text-red-600 border-red-500/20",
              )}
            >
              {isSuccess ? (
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              ) : (
                <XCircle className="mr-1.5 h-3.5 w-3.5" />
              )}
              {isSuccess ? "Platform Success" : "Platform Error"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono bg-muted w-fit px-2 py-1 rounded">
            {txn.id}
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4 flex items-center gap-6 shadow-sm">
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Funded Amount
            </p>
            <p className="text-2xl font-black text-primary">
              {fmt(txn.fundedAmount)}
            </p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="bg-primary/5 p-3 rounded-full">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                Execution Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 divide-y divide-border/50">
              <InfoRow
                label="Platform User Reference"
                value={txn.platformUserId}
                isId
              />
              <InfoRow
                label="Execution Timestamp"
                value={fmtDt(txn.fundedAt)}
              />
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">
                  Source Deposit
                </span>
                <Link
                  href={`/deposits/${txn.depositRequestId}`}
                  className="group flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <span className="font-mono text-xs">
                    {txn.depositRequestId}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-950 overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
                <Code2 className="h-4 w-4 text-emerald-500" />
                Platform Response Payload
              </CardTitle>
              <Badge
                variant="outline"
                className="text-[10px] uppercase border-slate-700 text-slate-500"
              >
                JSON Static
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <pre className="text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto custom-scrollbar p-2">
                {JSON.stringify(txn.platformResponse, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Context */}
        <div className="space-y-6">
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                System Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Platform Status
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      isSuccess ? "bg-emerald-500" : "bg-red-500",
                    )}
                  />
                  <span className="text-sm font-medium capitalize">
                    {isSuccess ? "Provisioned" : "Failed Verification"}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Last Synced
                </p>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {fmtDt(txn.fundedAt)}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-2xl border-2 border-dashed border-muted flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-primary/5 rounded-full">
              <UserIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">Need assistance?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If the funded amount doesn't match the platform balance, check
                the source deposit logs.
              </p>
            </div>
            <Link
              href="/support"
              className="text-xs font-semibold text-primary hover:underline pt-2"
            >
              Contact Engineering
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
