"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useTransactions } from "@/lib/api";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowUpRight, ArrowRightLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ListPageSkeleton } from "@/components/shared/skeletons";
import { QueryError } from "@/components/shared/QueryError";
import { PageHeader } from "@/components/shared/PageHeader";
import { ActiveFilterChips } from "@/components/shared/ActiveFilterChips";
import { ListPagination } from "@/components/shared/ListPagination";

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
  const { data, isLoading, error, refetch, isPending } = useTransactions({
    page,
    pageSize: 10,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  });

  const items = data?.items ?? [];
  const chipItems = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    const q = debouncedSearch.trim();
    return [
      {
        id: "search",
        label: `Search: “${q.slice(0, 28)}${q.length > 28 ? "…" : ""}”`,
        onRemove: () => {
          setSearch("");
          setPage(1);
        },
      },
    ];
  }, [debouncedSearch]);

  if (!data && isPending) {
    return <ListPageSkeleton />;
  }

  if (!data && error) {
    return (
      <QueryError
        title="Couldn’t load transactions"
        message="We couldn’t reach the server. Try again in a moment."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-300">
      <PageHeader
        title="Transactions"
        description="Successful fundings we’ve posted to your platform. Search by transaction ID or your platform user identifier."
      />

      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transaction ID or platform user…"
              className="h-11 border-border/80 bg-background pl-10 shadow-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          {debouncedSearch.trim() ? (
            <Button
              type="button"
              variant="outline"
              className="h-11 shrink-0 gap-2"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Clear search
            </Button>
          ) : null}
        </div>
        <ActiveFilterChips items={chipItems} className="mt-4" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Transaction
              </TableHead>
              <TableHead className="py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Platform user
              </TableHead>
              <TableHead className="py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Funded
              </TableHead>
              <TableHead className="hidden py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                Deposit
              </TableHead>
              <TableHead className="hidden py-3.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">
                Callback
              </TableHead>
              <TableHead className="py-3.5 pr-5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Settled
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
              items.map((txn) => (
                <TableRow
                  key={txn.id}
                  className="group relative border-border/50 transition-colors hover:bg-muted/35"
                >
                  <TableCell className="px-5 py-3.5">
                    <Link
                      href={`/transactions/${txn.id}`}
                      className="absolute inset-0 z-10 md:hidden"
                    >
                      <span className="sr-only">View</span>
                    </Link>
                    <Link
                      href={`/transactions/${txn.id}`}
                      className="relative z-20 hidden font-mono text-xs font-medium text-primary hover:underline md:inline"
                    >
                      {txn.id}
                    </Link>
                    <span className="font-mono text-[11px] text-muted-foreground md:hidden">
                      {txn.id.slice(0, 12)}…
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 text-sm font-medium">
                    {txn.platformUserId}
                  </TableCell>
                  <TableCell className="py-3.5 text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {fmt(txn.fundedAmount)}
                  </TableCell>
                  <TableCell className="hidden py-3.5 md:table-cell">
                    <span className="font-mono text-xs text-muted-foreground">
                      {txn.depositRequestId.slice(0, 14)}…
                    </span>
                  </TableCell>
                  <TableCell className="hidden py-3.5 lg:table-cell">
                    {(txn.platformResponse as { success?: boolean })
                      ?.success === true ? (
                      <Badge
                        variant="outline"
                        className="border-emerald-500/25 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                      >
                        Success
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-destructive/25 bg-destructive/10 text-xs font-medium text-destructive"
                      >
                        Error
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 pr-5 text-right text-xs tabular-nums text-muted-foreground">
                    <div>{format(new Date(txn.fundedAt), "MMM d")}</div>
                    <div className="text-[11px] opacity-80">
                      {format(new Date(txn.fundedAt), "HH:mm")}
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 pr-3">
                    <Link
                      href={`/transactions/${txn.id}`}
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
                      <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      No transactions yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Funded deposits will show up here. Try another search if
                      you expected results.
                    </p>
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
            noun="transactions"
            className="border-0 pt-0"
          />
        </div>
      </div>
    </div>
  );
}
