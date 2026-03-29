"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { mockDeposits, mockTransactions } from "@/lib/mock/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, Activity, ShieldCheck, Search } from "lucide-react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(value);

type TransactionFilter = "ALL" | "FUNDED" | "REJECTED" | "VERIFYING" | "OTHER";

export default function TransactionsPage() {
  const transactions = useMemo(
    () =>
      mockTransactions.map((transaction) => ({
        ...transaction,
        deposit: mockDeposits.find((dep) => dep.id === transaction.depositRequestId),
      })),
    []
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionFilter>("ALL");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.id.includes(searchTerm) ||
        transaction.deposit?.id?.includes(searchTerm) ||
        transaction.deposit?.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
      const status = transaction.deposit?.status ?? "UNKNOWN";
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "OTHER" && !["FUNDED", "VERIFIED", "REJECTED", "VERIFYING"].includes(status)) ||
        (statusFilter === "REJECTED" && status.includes("REJECTED")) ||
        (statusFilter === "VERIFYING" && status === "VERIFYING") ||
        (statusFilter === "FUNDED" && status === "FUNDED");
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  const totalFunded = filteredTransactions.reduce((sum, transaction) => sum + transaction.fundedAmount, 0);
  const pendingReviews = filteredTransactions.filter((transaction) =>
    (transaction.deposit?.status ?? "").includes("REJECTED")
  ).length;

  const statusClasses = (status?: string) => {
    if (!status) return "bg-slate-100 text-slate-700";
    if (status === "FUNDED" || status === "VERIFIED") return "bg-emerald-100 text-emerald-700";
    if (status.includes("REJECTED")) return "bg-rose-100 text-rose-700";
    if (status === "VERIFYING") return "bg-amber-100 text-amber-700";
    return "bg-blue-100 text-blue-700";
  };

  const filterOptions: { label: string; value: TransactionFilter }[] = [
    { label: "All", value: "ALL" },
    { label: "Funded", value: "FUNDED" },
    { label: "Rejects", value: "REJECTED" },
    { label: "Review", value: "VERIFYING" },
    { label: "Other", value: "OTHER" },
  ];

  return (
    <section className="space-y-6 pb-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Funded Transactions</h1>
        <p className="text-sm text-slate-500">Track every cleared transfer along with the originating deposit and platform response.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-slate-200 bg-white/80">
          <CardContent className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Funded total</p>
            <p className="text-2xl font-semibold text-slate-900">{formatCurrency(totalFunded)}</p>
            <p className="text-xs text-slate-400">{filteredTransactions.length} transactions shown</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white/80">
          <CardContent className="space-y-2 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Pending reviews</p>
              <ShieldCheck className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-2xl font-semibold text-slate-900">{pendingReviews}</p>
            <p className="text-xs text-slate-400">Awaiting action on {pendingReviews} records</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white/80">
          <CardContent className="space-y-2 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Average amount</p>
              <Activity className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-2xl font-semibold text-slate-900">
              {filteredTransactions.length > 0 ? formatCurrency(totalFunded / filteredTransactions.length) : "—"}
            </p>
            <p className="text-xs text-slate-400">Based on filtered list</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search transaction, deposit, method..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white px-10 py-2 text-sm text-slate-700 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>
        <div className="flex flex-wrap gap-2">
        {filterOptions.map((filterOption) => (
          <button
            key={filterOption.value}
            onClick={() => setStatusFilter(filterOption.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              statusFilter === filterOption.value
                ? "bg-slate-900 text-white"
                : "border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {filterOption.label}
          </button>
        ))}
        </div>
      </div>

      <Card className="border border-slate-200 bg-white">
        <CardContent className="p-0 overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-slate-50 text-slate-500">
              <TableRow>
                <TableHead className="text-xs font-semibold">Transaction</TableHead>
                <TableHead className="text-xs font-semibold">Deposit</TableHead>
                <TableHead className="text-xs font-semibold">Amount</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Funded at</TableHead>
                <TableHead className="text-xs font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => {
                const statusClass = statusClasses(transaction.deposit?.status);
                return (
                  <TableRow key={transaction.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono text-sm text-slate-700">
                      <Link href={`/transactions/${transaction.id}`} className="text-slate-900 hover:text-slate-700">
                        {transaction.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-600">
                        <p className="font-medium text-slate-900">{transaction.deposit?.id || "-"}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                          {transaction.deposit?.paymentMethod ?? "Unknown"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-slate-900">
                      {formatCurrency(transaction.fundedAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusClass} border border-slate-200 py-1 px-2 text-[10px]`}>
                        {transaction.deposit?.status?.replace(/_/g, " ") ?? "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {format(new Date(transaction.fundedAt), "MMM d, h:mm a")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/transactions/${transaction.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"
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
