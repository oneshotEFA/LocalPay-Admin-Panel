"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";

type LastCheckout = {
  checkoutID?: string;
  invoiceId?: string;
  at?: number;
};

export default function SuccessClient() {
  const sp = useSearchParams();
  const [stored] = useState<LastCheckout | null>(() => {
    try {
      const raw = sessionStorage.getItem("simulation:lastCheckout");
      if (!raw) return null;
      return JSON.parse(raw) as LastCheckout;
    } catch {
      return null;
    }
  });

  const invoiceId = useMemo(() => {
    const q = sp.get("invoiceId");
    return q?.trim() ? q.trim() : null;
  }, [sp]);

  const checkoutID = useMemo(() => {
    const q = sp.get("checkoutID") ?? sp.get("checkoutId");
    return q?.trim() ? q.trim() : null;
  }, [sp]);

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-300">
      <PageHeader
        title="Payment successful"
        description="The checkout completed successfully. You can view the final record in deposits or transactions."
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/deposits"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              View deposits
            </Link>
            <Link
              href="/transactions"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted"
            >
              View transactions
            </Link>
          </div>
        }
      />

      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-6">
        <div className="space-y-3 text-sm">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium text-foreground">Success</span>
          </div>

          {invoiceId ?? stored?.invoiceId ? (
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground">Invoice ID</span>
              <span className="font-mono text-[13px] text-foreground">
                {invoiceId ?? stored?.invoiceId}
              </span>
            </div>
          ) : null}

          {checkoutID ?? stored?.checkoutID ? (
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground">Checkout ID</span>
              <span className="font-mono text-[13px] text-foreground">
                {checkoutID ?? stored?.checkoutID}
              </span>
            </div>
          ) : null}

          {!invoiceId &&
          !checkoutID &&
          !stored?.invoiceId &&
          !stored?.checkoutID ? (
            <p className="text-muted-foreground">
              If you don’t see the record yet, give it a few seconds and refresh
              the deposits page.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

