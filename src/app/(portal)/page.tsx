"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  TrendingUp,
  ArrowUpRight,
  Activity,
  Download,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/Badge";
import { useDashboard, useCheckouts, useDeposits } from "@/lib/api";
import { DashboardPageSkeleton } from "@/components/shared/skeletons";
import { QueryError } from "@/components/shared/QueryError";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(n);

export default function OverviewPage() {
  const {
    data: dashboard,
    isLoading,
    error,
    refetch,
  } = useDashboard();
  const { data: recentCheckouts } = useCheckouts({ page: 1, pageSize: 5 });
  const { data: recentDeposits } = useDeposits({ page: 1, pageSize: 5 });

  if (isLoading) {
    return <DashboardPageSkeleton />;
  }

  if (error || !dashboard) {
    return (
      <QueryError
        title="Couldn’t load dashboard"
        message="We couldn’t refresh your overview. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const { client, overview } = dashboard;

  const statCards = [
    {
      label: "Checkouts This Month",
      value: overview.checkoutsThisMonth.toLocaleString(),
      delta: `${overview.pendingCheckouts} pending`,
      icon: Activity,
      alert: false,
    },
    {
      label: "Deposits This Month",
      value: overview.depositsThisMonth.toLocaleString(),
      delta: `${overview.pendingDeposits} pending`,
      icon: Download,
      alert: false,
    },
    {
      label: "Total Funded",
      value: fmt(overview.fundedAmountThisMonth),
      delta: `${overview.fundedTransactionsThisMonth} transactions`,
      icon: CheckCircle2,
      alert: false,
    },
    {
      label: "Needs Attention",
      value: (overview.pendingCheckouts + overview.pendingDeposits).toString(),
      delta: "Open items",
      icon: AlertTriangle,
      alert: true,
    },
  ];

  const getCheckoutBadge = (status: string) => {
    const map: Record<string, string> = {
      PAID: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
      PENDING:
        "bg-amber-500/15 text-amber-800 dark:text-amber-400 border-amber-500/25",
      FAILED: "bg-destructive/15 text-destructive border-destructive/25",
      EXPIRED: "bg-destructive/15 text-destructive border-destructive/25",
      CANCELLED: "bg-muted text-muted-foreground border-border",
    };
    return (
      <Badge
        variant="outline"
        className={`${map[status] ?? "bg-muted text-muted-foreground"} shadow-none text-xs font-medium`}
      >
        {status}
      </Badge>
    );
  };

  const getDepositBadge = (status: string) => {
    if (status === "FUNDED" || status === "VERIFIED") {
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25 shadow-none text-xs font-medium"
        >
          {status}
        </Badge>
      );
    }
    if (status.includes("REJECTED")) {
      return (
        <Badge
          variant="outline"
          className="bg-destructive/15 text-destructive border-destructive/25 shadow-none text-xs font-medium"
        >
          Rejected
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="bg-primary/10 text-primary border-primary/20 shadow-none text-xs font-medium"
      >
        {status.replace(/_/g, " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-300">
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/[0.07] blur-3xl dark:bg-primary/10"
          aria-hidden
        />
        <div className="relative max-w-3xl space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Overview
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
            Welcome back, {client.name}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Live snapshot of checkouts, deposit volume, and funding for the
            current month—same data as always, tuned for faster scanning.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <Card
            key={s.label}
            className={`rounded-2xl border-border/80 shadow-sm transition-all hover:border-primary/15 hover:shadow-md ${
              s.alert
                ? "border-destructive/35 bg-destructive/[0.06]"
                : "bg-card"
            }`}
          >
            <CardContent className="p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p
                  className={`text-[11px] font-semibold uppercase tracking-wider ${
                    s.alert ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </p>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    s.alert
                      ? "bg-destructive/15 text-destructive"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <s.icon className="h-4 w-4" strokeWidth={2} />
                </div>
              </div>
              <p
                className={`text-2xl font-bold tabular-nums tracking-tight sm:text-3xl ${
                  s.alert ? "text-destructive" : "text-foreground"
                }`}
              >
                {s.value}
              </p>
              <p
                className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
                  s.alert
                    ? "text-destructive/90"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {!s.alert && <TrendingUp className="h-3.5 w-3.5" />}
                {s.delta}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/80 bg-muted/25 px-5 py-4">
            <CardTitle className="text-sm font-semibold">Recent checkouts</CardTitle>
            <Link
              href="/checkouts"
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {(recentCheckouts?.items ?? []).length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                No checkouts yet this period.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground font-medium px-5 py-2.5">
                      ID / Invoice
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground font-medium py-2.5">
                      Amount
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground font-medium py-2.5">
                      Status
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground font-medium py-2.5 text-right pr-5">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(recentCheckouts?.items ?? []).map((chk) => (
                    <TableRow
                      key={chk.id}
                      className="border-border/60 hover:bg-muted/40 transition-colors"
                    >
                      <TableCell className="px-5 py-3">
                        <Link
                          href={`/checkouts/${chk.id}`}
                          className="font-medium text-foreground hover:text-primary text-sm transition-colors"
                        >
                          {chk.id.slice(0, 12)}…
                        </Link>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {chk.invoiceId}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-sm font-semibold tabular-nums">
                        {fmt(chk.amount)}
                      </TableCell>
                      <TableCell className="py-3">{getCheckoutBadge(chk.status)}</TableCell>
                      <TableCell className="py-3 text-right text-xs text-muted-foreground pr-5 tabular-nums">
                        {format(new Date(chk.createdAt), "MMM d, HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/80 bg-muted/25 px-5 py-4">
            <CardTitle className="text-sm font-semibold">Recent deposits</CardTitle>
            <Link
              href="/deposits"
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {(recentDeposits?.items ?? []).length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                No deposits yet this period.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableHead className="text-xs text-muted-foreground font-medium px-5 py-2.5">
                      ID / Method
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground font-medium py-2.5">
                      Amount
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground font-medium py-2.5">
                      Status
                    </TableHead>
                    <TableHead className="text-xs text-muted-foreground font-medium py-2.5 text-right pr-5">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(recentDeposits?.items ?? []).map((dep) => (
                    <TableRow
                      key={dep.id}
                      className="border-border/60 hover:bg-muted/40 transition-colors"
                    >
                      <TableCell className="px-5 py-3">
                        <Link
                          href={`/deposits/${dep.id}`}
                          className="font-medium text-foreground hover:text-primary text-sm transition-colors"
                        >
                          {dep.id.slice(0, 12)}…
                        </Link>
                        <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                          {dep.paymentMethod}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-sm font-semibold tabular-nums">
                        {fmt(dep.amount)}
                      </TableCell>
                      <TableCell className="py-3">{getDepositBadge(dep.status)}</TableCell>
                      <TableCell className="py-3 text-right text-xs text-muted-foreground pr-5 tabular-nums">
                        {format(new Date(dep.createdAt), "MMM d, HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
