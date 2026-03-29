"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { mockCheckouts } from "@/lib/mock/data";
import { CheckoutStatus } from "@/lib/types";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Calendar as CalendarIcon, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";


export default function CheckoutsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredCheckouts = mockCheckouts.filter(chk => {
    const matchesSearch = chk.id.includes(searchTerm) || chk.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) || chk.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || chk.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CheckoutStatus) => {
    switch (status) {
      case CheckoutStatus.PAID:
        return <Badge className="bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-200">Paid</Badge>;
      case CheckoutStatus.PENDING:
        return <Badge className="bg-amber-100 text-amber-800 border-none hover:bg-amber-200">Pending</Badge>;
      case CheckoutStatus.FAILED:
      case CheckoutStatus.EXPIRED:
      case CheckoutStatus.CANCELLED:
        return <Badge className="bg-rose-100 text-rose-800 border-none hover:bg-rose-200">{status}</Badge>;
      default:
        return <Badge variant={"outline"} >{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Checkouts</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage all payment sessions initiated by your platform.</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mock Date Filter Button */}
          <Button variant="outline" className="text-slate-600 bg-white shadow-sm border-slate-200">
            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
            Last 30 days
          </Button>
          <Button variant="outline" className="text-slate-600 bg-white shadow-sm border-slate-200">
            <Filter className="mr-2 h-4 w-4 text-slate-400" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by ID, invoice, or email..." 
            className="pl-9 bg-white border-slate-200 shadow-sm"
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {["ALL", ...Object.values(CheckoutStatus)].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                statusFilter === status 
                  ? "bg-slate-900 text-white" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow>
              <TableHead className="font-medium text-slate-600 w-[120px]">Checkout ID</TableHead>
              <TableHead className="font-medium text-slate-600">Invoice ID</TableHead>
              <TableHead className="font-medium text-slate-600">Amount</TableHead>
              <TableHead className="font-medium text-slate-600 hidden md:table-cell">Customer</TableHead>
              <TableHead className="font-medium text-slate-600">Status</TableHead>
              <TableHead className="font-medium text-slate-600 hidden lg:table-cell">Webhook</TableHead>
              <TableHead className="text-right font-medium text-slate-600">Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCheckouts.length > 0 ? (
              filteredCheckouts.map((chk) => (
                <TableRow key={chk.id} className="group hover:bg-slate-50 border-slate-100 cursor-pointer transition-colors relative">
                  <TableCell className="font-mono text-xs text-slate-600">
                    <Link href={`/checkouts/${chk.id}`} className="absolute inset-0 z-10">
                      <span className="sr-only">View checkout {chk.id}</span>
                    </Link>
                    {chk.id.slice(0, 10)}...
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-900">{chk.invoiceId}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-900">{formatCurrency(chk.amount)}</TableCell>
                  <TableCell className="text-sm text-slate-500 hidden md:table-cell">{chk.customerEmail}</TableCell>
                  <TableCell>{getStatusBadge(chk.status)}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {chk.webhookFiredAt ? (
                      <div>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Fired
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">{format(new Date(chk.webhookFiredAt), "MMM d, HH:mm")}</div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm text-slate-500">
                    {format(new Date(chk.createdAt), "MMM d, yyyy")}
                    <div className="text-xs">{format(new Date(chk.createdAt), "HH:mm")}</div>
                  </TableCell>
                  <TableCell>
                    <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 text-slate-300 mb-2" />
                    <p>No checkouts found matching your criteria.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 text-sm text-slate-500">
        <div>Showing {filteredCheckouts.length} of {mockCheckouts.length} results</div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled className="h-8 shadow-sm">Previous</Button>
          <Button variant="outline" size="sm" disabled className="h-8 shadow-sm">Next</Button>
        </div>
      </div>
    </div>
  );
}
