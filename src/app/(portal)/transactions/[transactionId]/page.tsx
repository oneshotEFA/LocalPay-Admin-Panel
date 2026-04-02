"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { mockTransactions } from "@/lib/mock/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, CheckCircle2, XCircle } from "lucide-react";
// import { useTransaction } from "@/lib/api"; // ← connect when ready

const fmt = (n: number) => new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB", maximumFractionDigits: 0 }).format(n);

export default function TransactionDetailPage({ params }: { params: Promise<{ transactionId: string }> }) {
  const { transactionId } = use(params);
  const txn = mockTransactions.find((t) => t.id === transactionId);
  if (!txn) notFound();

  const success = (txn.platformResponse as { success?: boolean })?.success === true;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      <div>
        <Link href="/transactions" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors">
          <ChevronLeft className="h-4 w-4" />Transactions
        </Link>
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight font-mono">{txn.id}</h1>
            <p className="text-sm text-slate-500 mt-0.5">Funded Transaction</p>
          </div>
          <div className="mt-1">
            {success
              ? <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shadow-none gap-1"><CheckCircle2 className="w-3.5 h-3.5" />Success</Badge>
              : <Badge className="bg-rose-100 text-rose-700 border-rose-200 shadow-none gap-1"><XCircle className="w-3.5 h-3.5" />Error</Badge>}
          </div>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-800">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {[
            ["Funded Amount", fmt(txn.fundedAmount)],
            ["Platform User ID", txn.platformUserId],
            ["Deposit Request ID", txn.depositRequestId],
            ["Client ID", txn.clientId ?? "—"],
            ["Funded At", format(new Date(txn.fundedAt), "MMM d, yyyy HH:mm:ss")],
          ].map(([k, v]) => (
            <div key={k} className="flex items-start justify-between gap-4 text-sm">
              <span className="text-slate-500 flex-shrink-0">{k}</span>
              <span className="text-slate-900 font-mono text-xs text-right">{v}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-800">Platform Response</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <pre className="text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-x-auto">
            {JSON.stringify(txn.platformResponse, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <div className="flex">
        <Link href={`/deposits/${txn.depositRequestId}`}
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium">
          View linked deposit →
        </Link>
      </div>
    </div>
  );
}
