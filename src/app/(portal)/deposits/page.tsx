"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { PaymentMethod } from "@/lib/types";
import { useDeposits } from "@/lib/api";
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
  XCircle,
  Clock,
  Building2,
  Smartphone,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
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

const METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CBE]: "Commercial Bank of Ethiopia",
  [PaymentMethod.TELEBIRR]: "Telebirr",
  [PaymentMethod.EBIRR]: "eBirr",
  [PaymentMethod.ABYSSINIA]: "Bank of Abyssinia",
  [PaymentMethod.NIB]: "Nib International Bank",
};

const METHOD_OPTIONS = [
  { value: "ALL", label: "All payment methods" },
  ...Object.values(PaymentMethod).map((m) => ({
    value: m,
    label: METHOD_LABELS[m],
  })),
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "All outcomes" },
  { value: "FUNDED", label: "Funded" },
  { value: "VERIFIED", label: "Verified" },
  { value: "VERIFYING", label: "Verifying" },
  { value: "PENDING_RECEIPT", label: "Awaiting receipt" },
  { value: "REJECTED", label: "Rejected (any reason)" },
];

export default function DepositsPage() {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const params = {
    page,
    pageSize: 10,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
    ...(methodFilter !== "ALL" ? { paymentMethod: methodFilter } : {}),
  };
  const { data, isLoading, error, refetch, isPending } = useDeposits(params);

  const items = data?.items ?? [];

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (debouncedSearch.trim()) n += 1;
    if (statusFilter !== "ALL") n += 1;
    if (methodFilter !== "ALL") n += 1;
    return n;
  }, [debouncedSearch, statusFilter, methodFilter]);

  const clearAllFilters = () => {
    setSearch("");
    setMethodFilter("ALL");
    setStatusFilter("ALL");
    setPage(1);
  };

  const chipItems = useMemo(() => {
    const chips: { id: string; label: string; onRemove: () => void }[] = [];
    if (debouncedSearch.trim()) {
      chips.push({
        id: "search",
        label: `Search: “${debouncedSearch.trim().slice(0, 20)}${debouncedSearch.trim().length > 20 ? "…" : ""}”`,
        onRemove: () => {
          setSearch("");
          setPage(1);
        },
      });
    }
    if (methodFilter !== "ALL") {
      const m = METHOD_OPTIONS.find((o) => o.value === methodFilter);
      chips.push({
        id: "method",
        label: `Method: ${m?.label ?? methodFilter}`,
        onRemove: () => {
          setMethodFilter("ALL");
          setPage(1);
        },
      });
    }
    if (statusFilter !== "ALL") {
      const s = STATUS_OPTIONS.find((o) => o.value === statusFilter);
      chips.push({
        id: "status",
        label: `Status: ${s?.label ?? statusFilter}`,
        onRemove: () => {
          setStatusFilter("ALL");
          setPage(1);
        },
      });
    }
    return chips;
  }, [debouncedSearch, methodFilter, statusFilter]);

  if (!data && isPending) {
    return <ListPageSkeleton />;
  }

  if (!data && error) {
    return (
      <QueryError
        title="Couldn’t load deposits"
        message="We couldn’t reach the server. Try again in a moment."
        onRetry={() => refetch()}
      />
    );
  }

  const getStatusBadge = (status: string) => {
    if (status === "FUNDED")
      return (
        <Badge
          variant="outline"
          className="gap-1 border-emerald-500/25 bg-emerald-500/10 text-xs font-medium text-emerald-700 shadow-none dark:text-emerald-400"
        >
          <CheckCircle2 className="h-3 w-3" />
          Funded
        </Badge>
      );
    if (status === "VERIFIED")
      return (
        <Badge
          variant="outline"
          className="gap-1 border-teal-500/25 bg-teal-500/10 text-xs font-medium text-teal-800 shadow-none dark:text-teal-400"
        >
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </Badge>
      );
    if (status.includes("REJECTED"))
      return (
        <Badge
          variant="outline"
          className="gap-1 border-destructive/25 bg-destructive/10 text-xs font-medium text-destructive shadow-none"
        >
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );
    return (
      <Badge
        variant="outline"
        className="gap-1 border-primary/20 bg-primary/10 text-xs font-medium text-primary shadow-none"
      >
        <Clock className="h-3 w-3" />
        {status.replace(/_/g, " ")}
      </Badge>
    );
  };

  const getMethodIcon = (method: PaymentMethod) => {
    const isMobileWallet =
      method === PaymentMethod.TELEBIRR || method === PaymentMethod.EBIRR;
    return isMobileWallet ? (
      <Smartphone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
    ) : (
      <Building2 className="h-3.5 w-3.5 text-primary" />
    );
  };

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-300">
      <PageHeader
        title="Deposits"
        description="Every verification attempt from your payers. Narrow by payment rail and lifecycle status—or search by deposit or checkout ID."
      />

      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search deposit ID, checkout ID, or keywords…"
              className="h-11 border-border/80 bg-background pl-10 shadow-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="hidden gap-4 md:flex md:flex-row md:items-end">
            <div className="min-w-0 flex-1 md:max-w-xs">
              <NativeSelect
                label="Payment method"
                value={methodFilter}
                onValueChange={(v) => {
                  setMethodFilter(v);
                  setPage(1);
                }}
                options={METHOD_OPTIONS}
              />
            </div>
            <div className="min-w-0 flex-1 md:max-w-xs">
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
          </div>

          <div className="flex gap-2 md:hidden">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 gap-2"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Method &amp; status
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
                className="h-11 text-muted-foreground"
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
        title="Refine deposits"
        description="Pick a payment rail and verification state. Changes apply immediately."
        activeCount={activeFilterCount}
        onClearAll={clearAllFilters}
      >
        <NativeSelect
          label="Payment method"
          value={methodFilter}
          onValueChange={(v) => {
            setMethodFilter(v);
            setPage(1);
          }}
          options={METHOD_OPTIONS}
        />
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
              <TableHead className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Deposit
              </TableHead>
              <TableHead className="py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Method
              </TableHead>
              <TableHead className="py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Amount
              </TableHead>
              <TableHead className="py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="hidden py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                Checkout
              </TableHead>
              <TableHead className="py-3.5 pr-5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Created
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  Loading…
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-sm text-destructive"
                >
                  Something went wrong.
                </TableCell>
              </TableRow>
            ) : items.length > 0 ? (
              items.map((dep) => (
                <TableRow
                  key={dep.id}
                  className="group relative border-border/50 transition-colors hover:bg-muted/35"
                >
                  <TableCell className="px-5 py-3.5">
                    <Link
                      href={`/deposits/${dep.id}`}
                      className="absolute inset-0 z-10 md:hidden"
                    >
                      <span className="sr-only">View</span>
                    </Link>
                    <Link
                      href={`/deposits/${dep.id}`}
                      className="relative z-20 hidden font-mono text-xs font-medium text-primary hover:underline md:inline"
                    >
                      {dep.id.slice(0, 14)}…
                    </Link>
                    <span className="font-mono text-xs text-muted-foreground md:hidden">
                      {dep.id.slice(0, 10)}…
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {getMethodIcon(dep.paymentMethod)}
                      <span className="hidden sm:inline">
                        {METHOD_LABELS[dep.paymentMethod] ?? dep.paymentMethod}
                      </span>
                      <span className="sm:hidden">{dep.paymentMethod}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 text-sm font-semibold tabular-nums">
                    {fmt(dep.amount)}
                  </TableCell>
                  <TableCell className="py-3.5">
                    {getStatusBadge(dep.status)}
                  </TableCell>
                  <TableCell className="hidden py-3.5 md:table-cell">
                    {dep.checkout?.id ? (
                      <span className="font-mono text-xs text-muted-foreground">
                        {dep.checkout.id.slice(0, 12)}…
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 pr-5 text-right text-xs tabular-nums text-muted-foreground">
                    {format(new Date(dep.createdAt), "MMM d, HH:mm")}
                  </TableCell>
                  <TableCell className="py-3.5 pr-3">
                    <Link
                      href={`/deposits/${dep.id}`}
                      className="relative z-20 hidden md:block"
                    >
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-2 px-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                      <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      No deposits match
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Relax filters or search with another ID.
                    </p>
                    {activeFilterCount > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-1"
                        onClick={clearAllFilters}
                      >
                        Reset filters
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
            noun="deposits"
            className="border-0 pt-0"
          />
        </div>
      </div>
    </div>
  );
}
