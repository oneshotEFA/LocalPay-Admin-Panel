"use client";

import Link from "next/link";
import { format } from "date-fns";
import { mockDeposits, mockTransactions } from "@/lib/mock/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight, Activity, ShieldCheck } from "lucide-react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(value);

export default function TransactionsPage() {
  const transactions = mockTransactions.map((transaction) => ({
    ...transaction,
    deposit: mockDeposits.find((dep) => dep.id === transaction.depositRequestId),
  }));

  const totalFunded = transactions.reduce((sum, transaction) => sum + transaction.fundedAmount, 0);
  const pendingReviews = mockDeposits.filter((dep) =>
    dep.status.includes("REJECTED") || dep.status === "VERIFYING"
  ).length;

  const getStatusClass = (status?: string) => {
    if (!status) return "bg-slate-100 text-slate-700";
    if (status === "FUNDED" || status === "VERIFIED") return "bg-emerald-100 text-emerald-700";
    if (status.includes("REJECTED")) return "bg-rose-100 text-rose-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <section className="space-y-6 pb-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-white">Funded Transactions</h1>
        <p className="text-sm text-slate-400">Track every cleared transfer along with the originating deposit and platform response.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-800/60 bg-slate-900/40">
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-slate-400">Total funded</p>
              <p className="text-2xl font-semibold text-white">{formatCurrency(totalFunded)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <Activity className="h-4 w-4 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-800/60 bg-slate-900/40">
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-slate-400">Transactions</p>
              <p className="text-2xl font-semibold text-white">{transactions.length}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-800/60 bg-slate-900/40">
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-slate-400">Average value</p>
              <p className="text-2xl font-semibold text-white">
                {transactions.length > 0
                  ? formatCurrency(totalFunded / transactions.length)
                  : formatCurrency(0)}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-800/60 bg-slate-900/40">
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-slate-400">Pending reviews</p>
              <p className="text-2xl font-semibold text-white">{pendingReviews}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <Badge className="bg-rose-100 text-rose-700 border-rose-200">{pendingReviews > 0 ? "Active" : "Idle"}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 bg-white/5">
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-900/30 text-slate-200">
              <TableRow>
                <TableHead className="text-xs font-semibold text-slate-400">Transaction ID</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400">Deposit</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400">Amount</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400">Status</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400">Funded at</TableHead>
                <TableHead className="text-xs font-semibold text-slate-400 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const statusClass = getStatusClass(transaction.deposit?.status);
                return (
                  <TableRow key={transaction.id} className="hover:bg-slate-900/40 transition-colors">
                    <TableCell className="font-mono text-xs text-slate-300">
                      <Link href={`/transactions/${transaction.id}`}>{transaction.id}</Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm text-slate-200">
                        <span className="font-mono text-xs">{transaction.deposit?.id || "-"}</span>
                        <span className="text-xs text-slate-400">
                          {transaction.deposit?.paymentMethod ?? "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-slate-100">
                      {formatCurrency(transaction.fundedAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusClass} border border-slate-200`}>
                        {transaction.deposit?.status?.replace(/_/g, " ") ?? "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-400">
                      {format(new Date(transaction.fundedAt), "MMM d, h:mm a")}
                    </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/transactions/${transaction.id}`}
                      className="inline-flex items-center gap-1 rounded-md border border-transparent px-3 py-1 text-xs font-medium text-slate-300 transition hover:text-slate-900"
                    >
                      View <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
