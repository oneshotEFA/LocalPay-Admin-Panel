"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CheckoutStatus } from "@/lib/types";
import { useCheckouts } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(n);

const STATUS_META: Record<
  string,
  { label: string; cls: string; icon: React.ElementType }
> = {
  PAID: {
    label: "Paid",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  PENDING: {
    label: "Pending",
    cls: "bg-amber-50  text-amber-700  border-amber-200",
    icon: Clock,
  },
  FAILED: {
    label: "Failed",
    cls: "bg-rose-50   text-rose-700   border-rose-200",
    icon: XCircle,
  },
  EXPIRED: {
    label: "Expired",
    cls: "bg-rose-50   text-rose-700   border-rose-200",
    icon: XCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    cls: "bg-slate-100 text-slate-600  border-slate-200",
    icon: XCircle,
  },
};

export default function CheckoutsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);
  const params = {
    page,
    pageSize: 10,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(statusFilter !== "ALL" && { status: statusFilter }),
  };
  const { data, isLoading, error } = useCheckouts(params);

  const getStatusBadge = (status: CheckoutStatus) => {
    const meta = STATUS_META[status];
    if (!meta)
      return (
        <Badge variant="outline" className="text-xs">
          {status}
        </Badge>
      );
    const Icon = meta.icon;
    return (
      <Badge className={cn("shadow-none gap-1 text-xs", meta.cls)}>
        <Icon className="w-3 h-3" />
        {meta.label}
      </Badge>
    );
  };
  console.log("Checkouts data:", data);
  const items = data?.items ?? [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Checkouts
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Payment sessions initiated by your platform.
          </p>
        </div>
        <Button
          variant="outline"
          className="bg-white border-slate-200 text-slate-600 text-sm shadow-sm self-start sm:self-auto"
        >
          <Calendar className="mr-2 h-4 w-4 text-slate-400" />
          Server filtered
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search ID, invoice, email…"
            className="pl-9 h-9 bg-white border-slate-200 shadow-sm text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["ALL", ...Object.values(CheckoutStatus)].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-full border transition-colors",
                statusFilter === s
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 border-b border-slate-200 hover:bg-slate-50/80">
              {[
                "Checkout ID",
                "Invoice ID",
                "Amount",
                "Customer",
                "Status",
                "Webhook",
                "Created",
                "",
              ].map((h, i) => (
                <TableHead
                  key={i}
                  className={cn(
                    "text-xs font-semibold text-slate-500 uppercase tracking-wide py-3",
                    i === 0 && "px-5 w-[150px]",
                    i === 3 && "hidden md:table-cell",
                    i === 5 && "hidden lg:table-cell",
                    i === 6 && "text-right pr-5",
                    i === 7 && "w-10",
                  )}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-36 text-center text-sm text-slate-500"
                >
                  Loading checkouts...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-36 text-center text-sm text-rose-600"
                >
                  Failed to load checkouts.
                </TableCell>
              </TableRow>
            ) : items.length > 0 ? (
              items.map((chk) => (
                <TableRow
                  key={chk.id}
                  className="group border-slate-100 hover:bg-slate-50/60 cursor-pointer relative transition-colors"
                >
                  <TableCell className="px-5 py-3.5">
                    <Link
                      href={`/checkouts/${chk.id}`}
                      className="absolute inset-0 z-10"
                    >
                      <span className="sr-only">View</span>
                    </Link>
                    <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {chk.id.slice(0, 12)}…
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 text-sm font-medium text-slate-800">
                    {chk.invoiceId}
                  </TableCell>
                  <TableCell className="py-3.5 text-sm font-semibold text-slate-900">
                    {fmt(chk.amount)}
                  </TableCell>
                  <TableCell className="py-3.5 text-sm text-slate-500 hidden md:table-cell">
                    {chk.customerEmail}
                  </TableCell>
                  <TableCell className="py-3.5">
                    {getStatusBadge(chk.status)}
                  </TableCell>
                  <TableCell className="py-3.5 hidden lg:table-cell">
                    {chk.webhookFiredAt ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                        <Zap className="h-3 w-3" />
                        Fired
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 text-right text-xs text-slate-500 pr-5">
                    {format(new Date(chk.createdAt), "MMM d")}
                    <br />
                    <span className="text-slate-400">
                      {format(new Date(chk.createdAt), "HH:mm")}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 pr-3">
                    <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-36 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Search className="h-7 w-7 mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">
                      No checkouts found
                    </p>
                    <p className="text-xs mt-0.5">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing{" "}
          <span className="font-medium text-slate-700">{items.length}</span> of{" "}
          <span className="font-medium text-slate-700">{data?.total ?? 0}</span>{" "}
          checkouts
        </span>
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
