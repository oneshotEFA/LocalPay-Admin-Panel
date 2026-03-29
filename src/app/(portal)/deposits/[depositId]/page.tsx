import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { mockDeposits, mockTransactions } from "@/lib/mock/data";
import { DepositStatus, ReceiptType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Clock, XCircle, FileText, Image as ImageIcon, Link as LinkIcon, AlertTriangle, ShieldCheck, Search, Activity, Building2, Smartphone } from "lucide-react";

export default async function DepositDetailPage({ params }: { params: { depositId: string } | Promise<{ depositId: string }> }) {
  const { depositId } = await params;
  const deposit = mockDeposits.find(d => d.id === depositId);
  
  if (!deposit) {
    notFound();
  }

  const transaction = mockTransactions.find((tx) => tx.depositRequestId === deposit?.id);

  const formatStepTime = (timestamp?: string) =>
    timestamp ? format(new Date(timestamp), "MMM d, yyyy h:mm a") : "pending";

  const timelineSteps = [
    {
      id: "receipt",
      label: "Receipt submitted",
      time: deposit?.receipt?.submittedAt,
      completed: Boolean(deposit?.receipt),
    },
    {
      id: "crawl",
      label: "Bank crawl captured",
      time: deposit?.crawlResult?.crawledAt,
      completed: Boolean(deposit?.crawlResult),
    },
    {
      id: "verifications",
      label: "Verification checks",
      time: deposit?.verifications?.[deposit.verifications.length - 1]?.ranAt,
      completed: (deposit.verifications?.length ?? 0) > 0,
    },
    {
      id: "funding",
      label: "Transaction funded",
      time: transaction?.fundedAt ?? (deposit.status === DepositStatus.FUNDED ? deposit.updatedAt : undefined),
      completed: Boolean(transaction) || deposit.status === DepositStatus.FUNDED,
    },
  ];

  const getStatusColor = (status: string) => {
    if (status === "FUNDED" || status === "VERIFIED") return "text-emerald-700 bg-emerald-100 border-emerald-200 mt-1";
    if (status.includes("REJECTED")) return "text-rose-700 bg-rose-100 border-rose-200 mt-1";
    return "text-blue-700 bg-blue-100 border-blue-200 mt-1";
  };

  const isRejected = deposit.status.includes("REJECTED");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center text-sm font-medium text-slate-500 space-x-2">
        <Link href="/deposits" className="hover:text-slate-900 transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> All Deposits
        </Link>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-[200px]">{deposit.id}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {formatCurrency(deposit.amount)}
            </h1>
            <Badge variant="outline" className={`px-2.5 py-1 text-sm font-semibold shadow-sm ${getStatusColor(deposit.status)}`}>
              {deposit.status.replace(/_/g, " ")}
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
            <p className="text-sm font-mono text-slate-600 bg-slate-100 py-1 px-2 rounded-md inline-flex">{deposit.id}</p>
            <div className="flex items-center text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 py-1 px-2 rounded-md w-fit">
              {deposit.paymentMethod.includes("BIRR") ? <Smartphone className="w-4 h-4 mr-1.5 text-emerald-600" /> : <Building2 className="w-4 h-4 mr-1.5 text-indigo-600" />}
              {deposit.paymentMethod}
            </div>
            {deposit.checkoutId && (
              <Link href={`/checkouts/${deposit.checkoutId}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center">
                <LinkIcon className="w-3.5 h-3.5 mr-1" /> View Checkout
              </Link>
            )}
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-sm font-medium text-slate-700">Created: {format(new Date(deposit.createdAt), "MMMM d, yyyy h:mm a")}</p>
          <div className="text-xs text-slate-500 mt-1">
            Updates: {format(new Date(deposit.updatedAt), "h:mm:ss a")}
          </div>
        </div>
      </div>

      {isRejected && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-rose-800">Deposit Rejected</h3>
              <div className="mt-2 text-sm text-rose-700">
                <p><strong>Reason:</strong> {deposit.rejectionReason || "Verification failed."}</p>
                {deposit.reasonCode && <p className="mt-1 font-mono text-xs opacity-80">Code: {deposit.reasonCode}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      <Card className="border border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-base flex items-center gap-2 text-slate-800">
            <Activity className="h-4 w-4 text-slate-400" /> Required steps
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {timelineSteps.map((step) => (
            <div key={step.id} className="space-y-2 rounded-xl border border-slate-100/80 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-[0.08em] text-slate-400">{step.label}</p>
                <Badge className={`text-[10px] ${step.completed ? "border-emerald-200 text-emerald-600" : "border-slate-200 text-slate-500"}`}>
                  {step.completed ? "Complete" : "Pending"}
                </Badge>
              </div>
              <p className="text-sm text-slate-600">{formatStepTime(step.time)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Receipt Section */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="text-base flex items-center"><FileText className="w-4 h-4 mr-2 text-slate-400" /> Customer Receipt</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {!deposit.receipt ? (
              <div className="text-center py-6">
                <p className="text-slate-500 text-sm">No receipt submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider bg-slate-50 border-slate-200 text-slate-600">
                      Type: {deposit.receipt.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500">
                    Extracted ID: <span className="font-mono text-slate-900 font-medium">{deposit.receipt.extractedTransactionId || "None"}</span>
                  </div>
                </div>

                {deposit.receipt.type === ReceiptType.SMS && (
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-emerald-400 shadow-inner border border-slate-800 leading-relaxed whitespace-pre-wrap">
                    {deposit.receipt.rawSmsText}
                  </div>
                )}

                {deposit.receipt.type === ReceiptType.SCREENSHOT && (
                  <div className="border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-400">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm font-medium text-slate-600">Screenshot Thumbnail</p>
                    <p className="text-xs mt-1">Found path: {deposit.receipt.screenshotPath}</p>
                  </div>
                )}

                {deposit.receipt.type === ReceiptType.LINK && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
                    <div className="truncate max-w-[80%]">
                      <p className="text-sm font-medium text-slate-900">Receipt URL</p>
                      <a href={deposit.receipt.rawLinkUrl || "#"} target="_blank" className="text-xs text-blue-600 hover:underline truncate block w-full mt-1">
                        {deposit.receipt.rawLinkUrl}
                      </a>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white">Open</Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Checks */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="text-base flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-slate-400" /> Verification Checks</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!deposit.verifications || deposit.verifications.length === 0 ? (
              <div className="text-center py-10 px-6">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium text-sm">Verifications pending.</p>
                <p className="text-slate-400 text-xs mt-1">Our system hasn't run automated checks yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 w-full overflow-hidden">
                {deposit.verifications.map((v) => (
                  <div key={v.id} className="p-4 flex items-start hover:bg-slate-50 transition-colors">
                    <div className="mt-0.5 flex-shrink-0 mr-4 bg-white rounded-full">
                      {v.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm font-semibold truncate ${v.passed ? 'text-slate-900' : 'text-rose-900'}`}>{v.check.replace(/_/g, " ")}</p>
                        {!v.passed && v.reasonCode && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-rose-100 text-rose-800">
                            {v.reasonCode}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{v.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Crawl Result */}
        <Card className="xl:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center"><Search className="w-4 h-4 mr-2 text-slate-400" /> Bank Audit (Crawl Result)</div>
              {deposit.crawlResult && (
                <div className="text-xs font-medium text-slate-500 flex items-center">
                  <Activity className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Live Data
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {!deposit.crawlResult ? (
              <div className="text-center py-6">
                <p className="text-slate-500 text-sm">Parser has not extracted bank data yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Confirmed Amount</p>
                  <p className={`mt-1 font-mono font-semibold text-lg ${deposit.crawlResult.confirmedAmount !== deposit.amount ? 'text-rose-600' : 'text-slate-900'}`}>
                    {deposit.crawlResult.confirmedAmount ? formatCurrency(deposit.crawlResult.confirmedAmount) : "N/A"}
                  </p>
                  {deposit.crawlResult.confirmedAmount !== deposit.amount && (
                    <p className="text-xs text-rose-500 mt-1 font-medium">Mismatch with checkout</p>
                  )}
                </div>
                
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Receiver Named</p>
                  <p className="mt-1 font-medium text-sm text-slate-900 truncate">
                    {deposit.crawlResult.confirmedReceiverName || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Receiver Account</p>
                  <p className="mt-1 font-mono font-medium text-sm text-slate-700">
                    {deposit.crawlResult.confirmedReceiverAccount || "N/A"}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Bank Timestamp</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {deposit.crawlResult.confirmedTimestamp ? format(new Date(deposit.crawlResult.confirmedTimestamp), "MMM d, HH:mm") : "N/A"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {transaction && (
          <Card className="xl:col-span-2 shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-slate-400" /> Transaction details
                </div>
                <Badge className="border-emerald-200 text-emerald-600">{deposit.status.replace(/_/g, " ")}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">Funded amount</p>
                  <p className="text-lg font-semibold text-slate-900">{formatCurrency(transaction.fundedAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Platform user</p>
                  <p className="text-sm font-medium text-slate-700">{transaction.platformUserId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Funded at</p>
                  <p className="text-sm font-medium text-slate-700">{format(new Date(transaction.fundedAt), "MMM d, h:mm a")}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500">Platform response</p>
                <pre className="mt-2 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
{JSON.stringify(transaction.platformResponse, null, 2)}
</pre>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs text-slate-500">Deposit</p>
                <Badge className="border border-slate-200">{deposit.id}</Badge>
                <Badge className="border border-slate-200 text-xs text-slate-500">Method: {deposit.paymentMethod}</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/transactions/${transaction.id}`}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  View transaction detail
                </Link>
                <Link
                  href={`/deposits/${deposit.id}`}
                  className="inline-flex items-center gap-1 rounded-md border border-transparent px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  Jump to deposit
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
