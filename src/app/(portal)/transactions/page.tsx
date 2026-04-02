"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useTransactions } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ArrowUpRight, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(n);

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading, error } = useTransactions({
    page,
    pageSize: 10,
    search: debouncedSearch || undefined,
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Transactions</h1>
        <p className="text-sm text-slate-500 mt-0.5">Settled funding records sent to your platform.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
        <Input
          placeholder="Search by ID or user…"
          className="pl-9 h-9 bg-white border-slate-200 shadow-sm text-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-200 hover:bg-slate-50/80">
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 w-[160px]">Transaction ID</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3">Platform User</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3">Funded Amount</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 hidden md:table-cell">Deposit ID</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 hidden lg:table-cell">Platform Response</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 text-right pr-5">Funded At</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-36 text-center text-sm text-slate-500">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="h-36 text-center text-sm text-rose-600">
                  Failed to load transactions.
                </TableCell>
              </TableRow>
            ) : items.length > 0 ? (
              items.map((txn) => (
                <TableRow key={txn.id} className="group border-slate-100 hover:bg-slate-50/60 cursor-pointer relative transition-colors">
                  <TableCell className="px-5 py-3.5">
                    <Link href={`/transactions/${txn.id}`} className="absolute inset-0 z-10"><span className="sr-only">View</span></Link>
                    <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{txn.id}</span>
                  </TableCell>
                  <TableCell className="py-3.5 text-sm font-medium text-slate-800">{txn.platformUserId}</TableCell>
                  <TableCell className="py-3.5 text-sm font-semibold text-emerald-700">{fmt(txn.fundedAmount)}</TableCell>
                  <TableCell className="py-3.5 hidden md:table-cell">
                    <span className="font-mono text-xs text-slate-500">{txn.depositRequestId.slice(0, 14)}…</span>
                  </TableCell>
                  <TableCell className="py-3.5 hidden lg:table-cell">
                    {(txn.platformResponse as { success?: boolean })?.success === true ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-none text-xs">Success</Badge>
                    ) : (
                      <Badge className="bg-rose-50 text-rose-700 border-rose-200 shadow-none text-xs">Error</Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 text-right text-xs text-slate-500 pr-5">
                    {format(new Date(txn.fundedAt), "MMM d")}<br />
                    <span className="text-slate-400">{format(new Date(txn.fundedAt), "HH:mm")}</span>
                  </TableCell>
                  <TableCell className="py-3.5 pr-3">
                    <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-36 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <ArrowRightLeft className="h-7 w-7 mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">No transactions found</p>
                    <p className="text-xs mt-0.5">Funded deposits will appear here</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Showing <span className="font-medium text-slate-700">{items.length}</span> of <span className="font-medium text-slate-700">{data?.total ?? 0}</span> transactions</span>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isLoading}
            className="h-8 text-xs"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!data?.hasMore || isLoading}
            className="h-8 text-xs"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
