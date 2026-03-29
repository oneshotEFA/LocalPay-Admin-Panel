import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { mockCheckouts, mockDeposits } from "@/lib/mock/data";
import { CheckoutStatus } from "@/lib/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Clock, XCircle, AlertCircle, Link as LinkIcon, RefreshCw, Send, Calendar, CheckSquare } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";



const getStatusBadge = (status: CheckoutStatus) => {
  switch (status) {
    case CheckoutStatus.PAID:
      return <Badge className="bg-emerald-100 text-emerald-800 border-none px-2.5 py-1 text-sm"><CheckCircle2 className="w-4 h-4 mr-1.5" />Paid</Badge>;
    case CheckoutStatus.PENDING:
      return <Badge className="bg-amber-100 text-amber-800 border-none px-2.5 py-1 text-sm"><Clock className="w-4 h-4 mr-1.5" />Pending</Badge>;
    case CheckoutStatus.FAILED:
    case CheckoutStatus.EXPIRED:
    case CheckoutStatus.CANCELLED:
      return <Badge className="bg-rose-100 text-rose-800 border-none px-2.5 py-1 text-sm"><XCircle className="w-4 h-4 mr-1.5" />{status}</Badge>;
    default:
      return <Badge variant="outline" className="px-2.5 py-1 text-sm">{status}</Badge>;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(amount);
};

export function generateStaticParams() {
  return mockCheckouts.map((checkout) => ({ checkoutId: checkout.id }));
}

export default async function CheckoutDetailPage({ params }: { params: { checkoutId: string } | Promise<{ checkoutId: string }> }) {
  const { checkoutId } = await params;
  const checkout = mockCheckouts.find(c => c.id === checkoutId);
  
  if (!checkout) {
    notFound();
  }

  const deposit = mockDeposits.find(d => d.checkoutId === checkout.id);

  // Webhook JSON mock formatting
  const webhookPayload = JSON.stringify({
    event: checkout.status === "PAID" ? "checkout.paid" : "checkout.updated",
    data: {
      id: checkout.id,
      invoiceId: checkout.invoiceId,
      amount: checkout.amount,
      status: checkout.status,
      transactionId: checkout.transactionId,
      customer: {
        email: checkout.customerEmail,
        name: checkout.customerName,
      }
    }
  }, null, 2);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center text-sm font-medium text-slate-500 space-x-2">
        <Link href="/checkouts" className="hover:text-slate-900 transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> All Checkouts
        </Link>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-[200px]">{checkout.id}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            {formatCurrency(checkout.amount)}
            {getStatusBadge(checkout.status)}
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-mono bg-slate-100 py-1 px-2 rounded-md inline-flex">{checkout.id}</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-sm font-medium text-slate-700">{format(new Date(checkout.createdAt), "MMMM d, yyyy 'at' h:mm a")}</p>
          <div className="text-xs text-slate-500 mt-1 flex items-center">
            <RefreshCw className="w-3 h-3 mr-1" /> Last updated: {format(new Date(checkout.updatedAt), "h:mm:ss a")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Checkout Details */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center"><CheckSquare className="w-5 h-5 mr-2 text-slate-400" /> Session Details</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableCell className="w-[180px] text-slate-500 py-4 font-medium">Invoice ID</TableCell>
                    <TableCell className="font-mono text-slate-900">{checkout.invoiceId}</TableCell>
                  </TableRow>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableCell className="w-[180px] text-slate-500 py-4 font-medium">Product Name</TableCell>
                    <TableCell className="text-slate-900">{checkout.productName}</TableCell>
                  </TableRow>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableCell className="w-[180px] text-slate-500 py-4 font-medium">Customer Email</TableCell>
                    <TableCell>
                      <a href={`mailto:${checkout.customerEmail}`} className="text-blue-600 hover:underline">{checkout.customerEmail}</a>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableCell className="w-[180px] text-slate-500 py-4 font-medium">Customer Name</TableCell>
                    <TableCell className="text-slate-900">{checkout.customerName}</TableCell>
                  </TableRow>
                  {checkout.transactionId && (
                    <TableRow className="border-slate-100 hover:bg-transparent">
                      <TableCell className="w-[180px] text-slate-500 py-4 font-medium">Bank Trans. ID</TableCell>
                      <TableCell className="font-mono font-medium text-indigo-700">{checkout.transactionId}</TableCell>
                    </TableRow>
                  )}
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableCell className="w-[180px] text-slate-500 py-4 font-medium flex items-center"><Calendar className="w-4 h-4 mr-2" /> Expires At</TableCell>
                    <TableCell className="text-slate-900">{format(new Date(checkout.expiresAt), "MMM d, yyyy h:mm a")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Linked Deposit Request */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2 text-slate-400" /> Linked Deposit
                </div>
                {deposit && (
                  <Link href={`/deposits/${deposit.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center bg-blue-50 px-3 py-1.5 rounded border border-blue-100 transition-colors">
                    View Deposit <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                  </Link>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!deposit ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium tracking-wide">No deposit has been linked yet.</p>
                  <p className="text-slate-400 text-sm mt-1">Waiting for the customer to submit a receipt.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Method</p>
                      <p className="mt-1 font-semibold text-slate-900">{deposit.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Amount</p>
                      <p className="mt-1 font-semibold text-slate-900">{formatCurrency(deposit.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Status</p>
                      <p className="mt-1 text-sm">
                        <Badge variant="outline" className="font-semibold bg-white shadow-sm border-slate-200">
                          {deposit.status.replace(/_/g, " ")}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Submitted</p>
                      <p className="mt-1 text-sm font-medium text-slate-700">{format(new Date(deposit.createdAt), "MMM d, h:mm a")}</p>
                    </div>
                  </div>

                  {deposit.verifications && deposit.verifications.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Automated Verification</h4>
                      <div className="rounded-lg border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                        {deposit.verifications.map((v) => (
                          <div key={v.id} className="p-3 flex items-start bg-white">
                            <div className="mt-0.5 flex-shrink-0 mr-3">
                              {v.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900">{v.check.replace(/_/g, " ")}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{v.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Webhook Delivery & URLs */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200 h-full">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center"><Send className="w-5 h-5 mr-2 text-slate-400" /> Developer Logs</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Configured URLs</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1 font-medium">Webhook URL</p>
                    <div className="bg-slate-50 rounded p-2 text-xs font-mono text-slate-700 break-all border border-slate-200">{checkout.webhookUrl}</div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1 font-medium">Success Redirect</p>
                    <div className="bg-slate-50 rounded p-2 text-xs font-mono text-slate-700 break-all border border-slate-200">{checkout.successUrl}</div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full my-4"></div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center justify-between uppercase tracking-wider">
                  Webhook Event
                  {checkout.webhookFiredAt ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-100 text-emerald-800 border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> DELIVERED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-slate-100 text-slate-600 border-slate-200">
                      PENDING
                    </span>
                  )}
                </h4>

                {checkout.webhookFiredAt ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-slate-50 rounded p-3 border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Time</p>
                        <p className="font-medium text-slate-900">{format(new Date(checkout.webhookFiredAt), "HH:mm:ss.SSS")}</p>
                      </div>
                      <div className="bg-slate-50 rounded p-3 border border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">HTTP Status</p>
                        <p className="font-mono text-emerald-600 font-semibold bg-emerald-50 inline-block px-1.5 rounded">200 OK</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-slate-500 mb-2 font-medium">Request Payload</p>
                      <pre className="bg-slate-950 text-slate-50 p-4 rounded-xl text-xs overflow-x-auto font-mono leading-relaxed max-h-[300px] overflow-y-auto">
                        {webhookPayload}
                      </pre>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-2 font-medium">Response Header</p>
                      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-xs overflow-x-auto font-mono border border-slate-200">
                        {checkout.webhookResponse || "Success"}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                    <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Waiting for checkout to reach a terminal state before firing webhook.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
