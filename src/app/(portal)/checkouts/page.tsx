"use client";

import type { ElementType } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CheckoutStatus } from "@/lib/types";
import { useCheckouts } from "@/lib/api";
import { useDebounce } from "@/lib/hooks/useDebounce";
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
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  Zap,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ListPageSkeleton } from "@/components/shared/skeletons";
import { QueryError } from "@/components/shared/QueryError";
import { PageHeader } from "@/components/shared/PageHeader";
import { NativeSelect } from "@/components/ui/native-select";
import { FilterDrawer } from "@/components/shared/FilterDrawer";
import { ActiveFilterChips } from "@/components/shared/ActiveFilterChips";
import { ListPagination } from "@/components/shared/ListPagination";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(n);

const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  ...Object.values(CheckoutStatus).map((s) => ({
    value: s,
    label: s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " "),
  })),
];

const STATUS_META: Record<
  string,
  { label: string; cls: string; icon: ElementType }
> = {
  PAID: {
    label: "Paid",
    cls: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  PENDING: {
    label: "Pending",
    cls: "bg-amber-500/12 text-amber-800 dark:text-amber-400 border-amber-500/20",
    icon: Clock,
  },
  FAILED: {
    label: "Failed",
    cls: "bg-destructive/12 text-destructive border-destructive/20",
    icon: XCircle,
  },
  EXPIRED: {
    label: "Expired",
    cls: "bg-destructive/12 text-destructive border-destructive/20",
    icon: XCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    cls: "bg-muted text-muted-foreground border-border",
    icon: XCircle,
  },
};

export default function CheckoutsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const params = {
    page,
    pageSize: 10,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
  };
  const { data, isLoading, error, refetch, isPending } = useCheckouts(params);

  const getStatusBadge = (status: CheckoutStatus) => {
    const meta = STATUS_META[status];
    if (!meta)
      return (
        <Badge variant="outline" className="text-xs font-medium">
          {status}
        </Badge>
      );
    const Icon = meta.icon;
    return (
      <Badge
        variant="outline"
        className={cn("gap-1 border font-medium shadow-none text-xs", meta.cls)}
      >
        <Icon className="h-3 w-3" />
        {meta.label}
      </Badge>
    );
  };

  const items = data?.items ?? [];

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (debouncedSearch.trim()) n += 1;
    if (statusFilter !== "ALL") n += 1;
    return n;
  }, [debouncedSearch, statusFilter]);

  const clearAllFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPage(1);
  };

  const chipItems = useMemo(() => {
    const chips: {
      id: string;
      label: string;
      onRemove: () => void;
    }[] = [];
    if (debouncedSearch.trim()) {
      chips.push({
        id: "search",
        label: `Search: “${debouncedSearch.trim().slice(0, 24)}${debouncedSearch.trim().length > 24 ? "…" : ""}”`,
        onRemove: () => {
          setSearch("");
          setPage(1);
        },
      });
    }
    if (statusFilter !== "ALL") {
      const opt = STATUS_OPTIONS.find((o) => o.value === statusFilter);
      chips.push({
        id: "status",
        label: `Status: ${opt?.label ?? statusFilter}`,
        onRemove: () => {
          setStatusFilter("ALL");
          setPage(1);
        },
      });
    }
    return chips;
  }, [debouncedSearch, statusFilter]);

  if (!data && isPending) {
    return <ListPageSkeleton />;
  }

  if (!data && error) {
    return (
      <QueryError
        title="Couldn’t load checkouts"
        message="We couldn’t reach the server. Try again in a moment."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-300">
      <PageHeader
        title="Checkouts"
        description="Payment sessions your customers start from your product. Filter by status or search by invoice, email, or ID."
      />

      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search invoice, email, checkout ID…"
              className="h-11 border-border/80 bg-background pl-10 shadow-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="hidden min-w-[12rem] flex-1 max-w-xs lg:block">
            <NativeSelect
              label="Status"
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
              options={STATUS_OPTIONS}
            />
          </div>

          <div className="flex gap-2 lg:shrink-0">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 gap-2 lg:hidden"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 ? (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary tabular-nums">
                  {activeFilterCount}
                </span>
              ) : null}
            </Button>
            {activeFilterCount > 0 ? (
              <Button
                type="button"
                variant="ghost"
                className="h-11 text-muted-foreground max-lg:flex-1"
                onClick={clearAllFilters}
              >
                Clear
              </Button>
            ) : null}
          </div>
        </div>

        <ActiveFilterChips items={chipItems} className="mt-4" />
      </div>

      <FilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        title="Filter checkouts"
        description="Choose a status to narrow the list. Search uses the field above."
        activeCount={activeFilterCount}
        onClearAll={clearAllFilters}
      >
        <NativeSelect
          label="Status"
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
          options={STATUS_OPTIONS}
        />
      </FilterDrawer>

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 bg-muted/40 hover:bg-muted/40">
              {[
                { h: "Checkout", c: "px-5", w: "" },
                { h: "Invoice", c: "", w: "" },
                { h: "Amount", c: "", w: "" },
                { h: "Customer", c: "hidden md:table-cell", w: "" },
                { h: "Status", c: "", w: "" },
                { h: "Webhook", c: "hidden lg:table-cell", w: "" },
                { h: "Created", c: "pr-5 text-right", w: "" },
                { h: "", c: "w-10", w: "" },
              ].map((col) => (
                <TableHead
                  key={col.h}
                  className={cn(
                    "py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                    col.c,
                  )}
                >
                  {col.h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  Loading…
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-sm text-destructive"
                >
                  Something went wrong. Use Retry above.
                </TableCell>
              </TableRow>
            ) : items.length > 0 ? (
              items.map((chk) => (
                <TableRow
                  key={chk.id}
                  className="group relative border-border/50 transition-colors hover:bg-muted/35"
                >
                  <TableCell className="px-5 py-3.5">
                    <Link
                      href={`/checkouts/${chk.id}`}
                      className="absolute inset-0 z-10 md:hidden"
                    >
                      <span className="sr-only">View</span>
                    </Link>
                    <Link
                      href={`/checkouts/${chk.id}`}
                      className="relative z-20 hidden font-mono text-xs font-medium text-primary hover:underline md:inline"
                    >
                      {chk.id.slice(0, 14)}…
                    </Link>
                    <span className="font-mono text-xs text-muted-foreground md:hidden">
                      {chk.id.slice(0, 10)}…
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 text-sm font-medium">
                    {chk.invoiceId}
                  </TableCell>
                  <TableCell className="py-3.5 text-sm font-semibold tabular-nums">
                    {fmt(chk.amount)}
                  </TableCell>
                  <TableCell className="hidden py-3.5 text-sm text-muted-foreground md:table-cell">
                    {chk.customerEmail}
                  </TableCell>
                  <TableCell className="py-3.5">
                    {getStatusBadge(chk.status)}
                  </TableCell>
                  <TableCell className="hidden py-3.5 lg:table-cell">
                    {chk.webhookFiredAt ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        <Zap className="h-3 w-3" />
                        Delivered
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 pr-5 text-right text-xs tabular-nums text-muted-foreground">
                    <div>{format(new Date(chk.createdAt), "MMM d")}</div>
                    <div className="text-[11px] opacity-80">
                      {format(new Date(chk.createdAt), "HH:mm")}
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 pr-3">
                    <Link
                      href={`/checkouts/${chk.id}`}
                      className="relative z-20 hidden md:block"
                    >
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-44 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-2 px-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                      <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      No checkouts match
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Try clearing filters or search with a different keyword.
                    </p>
                    {activeFilterCount > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-1"
                        onClick={clearAllFilters}
                      >
                        Clear filters
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="border-t border-border/60 bg-muted/20 px-4 py-3 sm:px-5">
          <ListPagination
            page={page}
            totalLoaded={items.length}
            totalKnown={data?.total ?? 0}
            hasMore={data?.hasMore ?? false}
            isLoading={isLoading}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
            noun="checkouts"
            className="border-0 pt-0"
          />
        </div>
      </div>
    </div>
  );
}
