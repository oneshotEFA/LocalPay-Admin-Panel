"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { mockDeposits } from "@/lib/mock/data";
import { PaymentMethod } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ArrowUpRight, CheckCircle2, XCircle, Clock, Building2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
// import { useDeposits } from "@/lib/api"; // ← connect when ready

const fmt = (n: number) => new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB", maximumFractionDigits: 0 }).format(n);

const STATUS_FILTERS = ["ALL", "FUNDED", "VERIFIED", "VERIFYING", "PENDING_RECEIPT", "REJECTED"] as const;

export default function DepositsPage() {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = mockDeposits.filter((dep) => {
    const matchSearch = dep.id.toLowerCase().includes(search.toLowerCase()) ||
      (dep.checkoutId ?? "").toLowerCase().includes(search.toLowerCase());
    const matchMethod = methodFilter === "ALL" || dep.paymentMethod === methodFilter;
    const matchStatus = statusFilter === "ALL" || dep.status.includes(statusFilter.replace("REJECTED", "REJECTED"));
    return matchSearch && matchMethod && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === "FUNDED") return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-none gap-1 text-xs"><CheckCircle2 className="w-3 h-3" />Funded</Badge>;
    if (status === "VERIFIED") return <Badge className="bg-teal-50 text-teal-700 border-teal-200 shadow-none gap-1 text-xs"><CheckCircle2 className="w-3 h-3" />Verified</Badge>;
    if (status.includes("REJECTED")) return <Badge className="bg-rose-50 text-rose-700 border-rose-200 shadow-none gap-1 text-xs"><XCircle className="w-3 h-3" />Rejected</Badge>;
    return <Badge className="bg-blue-50 text-blue-700 border-blue-200 shadow-none gap-1 text-xs"><Clock className="w-3 h-3" />{status.replace(/_/g, " ")}</Badge>;
  };

  const getMethodIcon = (method: PaymentMethod) => {
    const isMobile = method === PaymentMethod.TELEBIRR || method === PaymentMethod.EBIRR;
    return isMobile
      ? <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
      : <Building2 className="w-3.5 h-3.5 text-indigo-500" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Deposit Requests</h1>
          <p className="text-sm text-slate-500 mt-0.5">Audit customer deposit attempts and verification results.</p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input placeholder="Search by ID or checkout ID…" className="pl-9 bg-white border-slate-200 h-9 text-sm shadow-sm"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Method:</span>
            {["ALL", ...Object.values(PaymentMethod)].map((m) => (
              <button key={m} onClick={() => setMethodFilter(m)}
                className={cn("px-2.5 py-1 text-xs font-medium rounded-full border transition-colors",
                  methodFilter === m ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}>
                {m}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            {STATUS_FILTERS.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn("px-2.5 py-1 text-xs font-medium rounded-full border transition-colors",
                  statusFilter === s ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-200 hover:bg-slate-50/80">
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 w-[150px]">Deposit ID</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3">Method</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3">Amount</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 hidden md:table-cell">Checkout</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 text-right pr-5">Created</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? filtered.map((dep) => (
              <TableRow key={dep.id} className="group border-slate-100 hover:bg-slate-50/60 cursor-pointer transition-colors relative">
                <TableCell className="px-5 py-3.5">
                  <Link href={`/deposits/${dep.id}`} className="absolute inset-0 z-10"><span className="sr-only">View</span></Link>
                  <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{dep.id.slice(0, 12)}…</span>
                </TableCell>
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    {getMethodIcon(dep.paymentMethod)}{dep.paymentMethod}
                  </div>
                </TableCell>
                <TableCell className="py-3.5 text-sm font-semibold text-slate-900">{fmt(dep.amount)}</TableCell>
                <TableCell className="py-3.5">{getStatusBadge(dep.status)}</TableCell>
                <TableCell className="py-3.5 hidden md:table-cell">
                  {dep.checkoutId
                    ? <span className="font-mono text-xs text-slate-500">{dep.checkoutId.slice(0, 12)}…</span>
                    : <span className="text-slate-300 text-xs">—</span>}
                </TableCell>
                <TableCell className="py-3.5 text-right text-xs text-slate-500 pr-5">{format(new Date(dep.createdAt), "MMM d, HH:mm")}</TableCell>
                <TableCell className="py-3.5 pr-3">
                  <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} className="h-36 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Search className="h-7 w-7 mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">No deposits found</p>
                    <p className="text-xs mt-0.5">Try adjusting your filters</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Showing <span className="font-medium text-slate-700">{filtered.length}</span> of <span className="font-medium text-slate-700">{mockDeposits.length}</span> deposits</span>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">Previous</Button>
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">Next</Button>
        </div>
      </div>
    </div>
  );
}
