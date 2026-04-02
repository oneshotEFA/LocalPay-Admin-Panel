"use client";

import Link from "next/link";
import { format } from "date-fns";
import { TrendingUp, ArrowUpRight, Activity, Download, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDashboard, useCheckouts, useDeposits } from "@/lib/api";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(n);

export default function OverviewPage() {
  const { data: dashboard, isLoading, error } = useDashboard();
  const { data: recentCheckouts } = useCheckouts({ page: 1, pageSize: 5 });
  const { data: recentDeposits } = useDeposits({ page: 1, pageSize: 5 });

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading dashboard...</div>;
  }

  if (error || !dashboard) {
    return <div className="text-sm text-rose-600">Failed to load dashboard data.</div>;
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
      PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
      PENDING: "bg-amber-100 text-amber-700 border-amber-200",
      FAILED: "bg-rose-100 text-rose-700 border-rose-200",
      EXPIRED: "bg-rose-100 text-rose-700 border-rose-200",
      CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
    };
    return (
      <Badge className={`${map[status] ?? "bg-slate-100 text-slate-600"} shadow-none text-xs`}>
        {status}
      </Badge>
    );
  };

  const getDepositBadge = (status: string) => {
    if (status === "FUNDED" || status === "VERIFIED") {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shadow-none text-xs">
          {status}
        </Badge>
      );
    }
    if (status.includes("REJECTED")) {
      return (
        <Badge className="bg-rose-100 text-rose-700 border-rose-200 shadow-none text-xs">
          Rejected
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 shadow-none text-xs">
        {status.replace(/_/g, " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Welcome back, {client.name}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Here&apos;s your payment operations snapshot for this month.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card
            key={s.label}
            className={`border shadow-sm transition-shadow hover:shadow-md ${
              s.alert ? "border-rose-200 bg-rose-50/40" : "border-slate-200"
            }`}
          >
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between mb-3">
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${
                    s.alert ? "text-rose-500" : "text-slate-500"
                  }`}
                >
                  {s.label}
                </p>
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    s.alert ? "bg-rose-100" : "bg-slate-100"
                  }`}
                >
                  <s.icon
                    className={`h-4 w-4 ${s.alert ? "text-rose-500" : "text-slate-500"}`}
                  />
                </div>
              </div>
              <p
                className={`text-2xl font-bold tracking-tight ${
                  s.alert ? "text-rose-700" : "text-slate-900"
                }`}
              >
                {s.value}
              </p>
              <p
                className={`text-xs mt-1 flex items-center gap-1 ${
                  s.alert ? "text-rose-500" : "text-emerald-600"
                }`}
              >
                {!s.alert && <TrendingUp className="h-3 w-3" />}
                {s.delta}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Recent Checkouts
            </CardTitle>
            <Link
              href="/checkouts"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-0 hover:bg-transparent">
                  <TableHead className="text-xs text-slate-400 font-medium px-5 py-2.5">
                    ID / Invoice
                  </TableHead>
                  <TableHead className="text-xs text-slate-400 font-medium py-2.5">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs text-slate-400 font-medium py-2.5">
                    Status
                  </TableHead>
                  <TableHead className="text-xs text-slate-400 font-medium py-2.5 text-right pr-5">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(recentCheckouts?.items ?? []).map((chk) => (
                  <TableRow key={chk.id} className="border-slate-100 hover:bg-slate-50/60 transition-colors">
                    <TableCell className="px-5 py-3">
                      <Link
                        href={`/checkouts/${chk.id}`}
                        className="font-medium text-slate-900 hover:text-blue-600 text-sm transition-colors"
                      >
                        {chk.id.slice(0, 12)}…
                      </Link>
                      <div className="text-xs text-slate-400 mt-0.5">{chk.invoiceId}</div>
                    </TableCell>
                    <TableCell className="py-3 text-sm font-semibold text-slate-800">
                      {fmt(chk.amount)}
                    </TableCell>
                    <TableCell className="py-3">{getCheckoutBadge(chk.status)}</TableCell>
                    <TableCell className="py-3 text-right text-xs text-slate-400 pr-5">
                      {format(new Date(chk.createdAt), "MMM d, HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Recent Deposits
            </CardTitle>
            <Link
              href="/deposits"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-0 hover:bg-transparent">
                  <TableHead className="text-xs text-slate-400 font-medium px-5 py-2.5">
                    ID / Method
                  </TableHead>
                  <TableHead className="text-xs text-slate-400 font-medium py-2.5">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs text-slate-400 font-medium py-2.5">
                    Status
                  </TableHead>
                  <TableHead className="text-xs text-slate-400 font-medium py-2.5 text-right pr-5">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(recentDeposits?.items ?? []).map((dep) => (
                  <TableRow key={dep.id} className="border-slate-100 hover:bg-slate-50/60 transition-colors">
                    <TableCell className="px-5 py-3">
                      <Link
                        href={`/deposits/${dep.id}`}
                        className="font-medium text-slate-900 hover:text-blue-600 text-sm transition-colors"
                      >
                        {dep.id.slice(0, 12)}…
                      </Link>
                      <div className="text-xs text-slate-400 mt-0.5 font-medium">
                        {dep.paymentMethod}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-sm font-semibold text-slate-800">
                      {fmt(dep.amount)}
                    </TableCell>
                    <TableCell className="py-3">{getDepositBadge(dep.status)}</TableCell>
                    <TableCell className="py-3 text-right text-xs text-slate-400 pr-5">
                      {format(new Date(dep.createdAt), "MMM d, HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
