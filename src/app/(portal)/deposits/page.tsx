"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { mockDeposits } from "@/lib/mock/data";
import { PaymentMethod } from "@/lib/types";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, ArrowUpRight, CheckCircle2, XCircle, Clock, Building2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function DepositsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");

  const filteredDeposits = mockDeposits.filter(dep => {
    const matchesSearch = dep.id.includes(searchTerm) || (dep.checkoutId || "").includes(searchTerm);
    const matchesMethod = methodFilter === "ALL" || dep.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const getStatusBadge = (status: string) => {
    if (status === "FUNDED" || status === "VERIFIED") {
      return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 flex items-center w-fit"><CheckCircle2 className="w-3.5 h-3.5 mr-1" />{status}</Badge>;
    }
    if (status.includes("REJECTED")) {
      return <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200 flex items-center w-fit"><XCircle className="w-3.5 h-3.5 mr-1" />Rejected</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 flex items-center w-fit"><Clock className="w-3.5 h-3.5 mr-1" />{status.replace(/_/g, " ")}</Badge>;
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CBE:
      case PaymentMethod.ABYSSINIA:
      case PaymentMethod.NIB:
        return <Building2 className="w-4 h-4 mr-1.5 text-indigo-500" />;
      case PaymentMethod.TELEBIRR:
      case PaymentMethod.EBIRR:
        return <Smartphone className="w-4 h-4 mr-1.5 text-emerald-500" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Deposit Requests</h1>
          <p className="text-sm text-slate-500 mt-1">Audit customer deposit attempts and verifications.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-slate-600 bg-white shadow-sm border-slate-200">
            <Filter className="mr-2 h-4 w-4 text-slate-400" />
            More Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by deposit ID or checkout ID..." 
            className="pl-9 bg-white shadow-sm border-slate-200 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {["ALL", ...Object.values(PaymentMethod)].map((method) => (
            <button
              key={method}
              onClick={() => setMethodFilter(method)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                methodFilter === method 
                  ? "bg-slate-900 text-white shadow" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow className="hover:bg-slate-50">
              <TableHead className="font-medium text-slate-600 w-[140px]">Deposit ID</TableHead>
              <TableHead className="font-medium text-slate-600">Method</TableHead>
              <TableHead className="font-medium text-slate-600">Amount</TableHead>
              <TableHead className="font-medium text-slate-600">Status</TableHead>
              <TableHead className="font-medium text-slate-600 hidden md:table-cell">Checkout ID</TableHead>
              <TableHead className="text-right font-medium text-slate-600">Created</TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeposits.length > 0 ? (
              filteredDeposits.map((dep) => (
                <TableRow key={dep.id} className="group hover:bg-slate-50 border-slate-100 cursor-pointer transition-colors relative">
                  <TableCell className="font-mono text-xs text-slate-600">
                    <Link href={`/deposits/${dep.id}`} className="absolute inset-0 z-10">
                      <span className="sr-only">View deposit {dep.id}</span>
                    </Link>
                    {dep.id.slice(0, 10)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm font-medium text-slate-700">
                      {getMethodIcon(dep.paymentMethod)}
                      {dep.paymentMethod}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-900">{formatCurrency(dep.amount)}</TableCell>
                  <TableCell>{getStatusBadge(dep.status)}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs font-mono text-slate-500">
                    {dep.checkoutId ? `${dep.checkoutId.slice(0, 10)}...` : '-'}
                  </TableCell>
                  <TableCell className="text-right text-sm text-slate-500">
                    {format(new Date(dep.createdAt), "MMM d, HH:mm")}
                  </TableCell>
                  <TableCell>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 text-slate-300 mb-2" />
                    <p>No deposit requests found matching your criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between px-2 text-sm text-slate-500">
        <div>Showing {filteredDeposits.length} of {mockDeposits.length} results</div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled className="h-8 shadow-sm">Previous</Button>
          <Button variant="outline" size="sm" disabled className="h-8 shadow-sm">Next</Button>
        </div>
      </div>
    </div>
  );
}
