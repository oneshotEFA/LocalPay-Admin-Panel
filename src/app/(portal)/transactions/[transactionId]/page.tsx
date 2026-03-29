import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { mockDeposits, mockTransactions } from "@/lib/mock/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(value);

const getStatusColor = (status?: string) => {
  if (!status) return "bg-slate-100 text-slate-700";
  if (status === "FUNDED" || status === "VERIFIED") return "bg-emerald-100 text-emerald-700";
  if (status.includes("REJECTED")) return "bg-rose-100 text-rose-700";
  return "bg-blue-100 text-blue-700";
};

export function generateStaticParams() {
  return mockTransactions.map((transaction) => ({ transactionId: transaction.id }));
}

export default async function TransactionDetailPage({ params }: { params: { transactionId: string } | Promise<{ transactionId: string }> }) {
  const { transactionId } = await params;
  const transaction = mockTransactions.find((tx) => tx.id === transactionId);
  if (!transaction) {
    notFound();
  }

  const deposit = mockDeposits.find((dep) => dep.id === transaction.depositRequestId);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
        <Link href="/transactions" className="flex items-center gap-1 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> All transactions
        </Link>
        <span>/</span>
        <span className="text-slate-900">{transaction.id}</span>
      </div>

      <Card className="border border-slate-200 bg-white/90 shadow-sm">
        <CardHeader className="border-b border-slate-200 bg-slate-50/70">
          <CardTitle className="text-base text-slate-800">Transaction summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase text-slate-500">Funded amount</p>
              <p className="text-2xl font-semibold text-slate-900">{formatCurrency(transaction.fundedAmount)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(deposit?.status)} border border-slate-200`}>
                Deposit: {deposit?.status?.replace(/_/g, " ") ?? "Unknown"}
              </Badge>
              <Badge className="border border-slate-200 text-xs text-slate-500">
                Platform ID: {transaction.platformUserId}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Funded at {format(new Date(transaction.fundedAt), "MMMM d, h:mm a")}</span>
            <span className="text-xs text-slate-400">Linked deposit {deposit?.id ?? "N/A"}</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">Platform response</p>
            <pre className="mt-2 max-h-52 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
{JSON.stringify(transaction.platformResponse, null, 2)}
</pre>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/transactions/${transaction.id}`}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Refresh
            </Link>
            {deposit && (
              <Link
                href={`/deposits/${deposit.id}`}
                className="inline-flex items-center gap-1 rounded-md border border-transparent px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
              >
                View deposit
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {deposit && (
        <Card className="border border-slate-200 bg-white/90 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-slate-50/70">
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" /> Deposit metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs uppercase text-slate-500">Receipt proof</p>
              {deposit.receipt ? (
                <div className="space-y-1 text-sm text-slate-700">
                  <p>Type: {deposit.receipt.type}</p>
                  {deposit.receipt.rawSmsText && <p>SMS: {deposit.receipt.rawSmsText}</p>}
                  {deposit.receipt.rawLinkUrl && (
                    <p className="truncate text-xs text-blue-600">Link: {deposit.receipt.rawLinkUrl}</p>
                  )}
                  {deposit.receipt.screenshotPath && (
                    <p className="text-xs text-slate-500">Screenshot: {deposit.receipt.screenshotPath}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Proof pending.</p>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase text-slate-500">Crawl result</p>
              {deposit.crawlResult ? (
                <div className="space-y-1 text-sm text-slate-700">
                  <p>
                    Amount: {deposit.crawlResult.confirmedAmount ? formatCurrency(deposit.crawlResult.confirmedAmount) : "N/A"}
                  </p>
                  <p>Receiver: {deposit.crawlResult.confirmedReceiverName ?? "Unknown"}</p>
                  <p>Account: {deposit.crawlResult.confirmedReceiverAccount ?? "Unknown"}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Crawler not run yet.</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <p className="text-xs uppercase text-slate-500">Verification checks</p>
              {deposit.verifications && deposit.verifications.length > 0 ? (
                deposit.verifications.map((check) => (
                  <div
                    key={check.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
                  >
                    <span>{check.check.replace(/_/g, " ")}</span>
                    <Badge
                      className={
                        check.passed
                          ? "border border-emerald-200 bg-emerald-100 text-emerald-700"
                          : "border border-rose-200 bg-rose-100 text-rose-700"
                      }
                    >
                      {check.passed ? "Passed" : "Failed"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Awaiting automated validations.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
