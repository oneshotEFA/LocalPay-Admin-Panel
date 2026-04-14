"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { simulatePayment } from "@/lib/api/client";

type Gateway = "localpay" | "binance";

interface FormState {
  apiKey: string;
  apiSecret: string;
  amount: string;
  invoiceId: string;
  gateway: Gateway;
}

const initialState: FormState = {
  apiKey: "",
  apiSecret: "",
  amount: "",
  invoiceId: "",
  gateway: "localpay",
};

export default function PaymentSimulationPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    if (!form.apiKey) return "API Key is required";
    if (!form.apiSecret) return "API Secret is required";
    if (!form.amount || Number(form.amount) <= 0)
      return "Valid amount is required";
    return null;
  };

  const generateInvoiceId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return `INV-${crypto.randomUUID()}`;
    }
    return `INV-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const invoiceId = form.invoiceId?.trim() || generateInvoiceId();
      if (!form.invoiceId?.trim()) {
        setForm((prev) => ({ ...prev, invoiceId }));
      }
      const configuredBase = (process.env.NEXT_PUBLIC_URL ?? "").replace(
        /\/+$/,
        "",
      );
      const fallbackBase =
        typeof window !== "undefined" ? window.location.origin : "";
      const baseUrl = configuredBase || fallbackBase;
      console.log(
        `${baseUrl}/api/simulation/webhook?invoiceId=${encodeURIComponent(invoiceId)}`,
      );
      const data = await simulatePayment({
        apiKey: form.apiKey,
        apiSecret: form.apiSecret,
        amount: Number(form.amount),
        invoiceId,
        productName: "LocalPay Simulation",
        successUrl: `${baseUrl}/simulation/success?invoiceId=${encodeURIComponent(invoiceId)}`,
        cancelUrl: `${baseUrl}/simulation/cancel?invoiceId=${encodeURIComponent(invoiceId)}`,
        failedUrl: `${baseUrl}/simulation/failed?invoiceId=${encodeURIComponent(invoiceId)}`,
        webhookUrl: `${baseUrl}/api/simulation/webhook?invoiceId=${encodeURIComponent(invoiceId)}`,
      });

      setResponse(data);

      if ("checkoutUrl" in data && data.checkoutUrl) {
        if ("checkoutID" in data && data.checkoutID) {
          sessionStorage.setItem(
            "simulation:lastCheckout",
            JSON.stringify({
              checkoutID: data.checkoutID,
              invoiceId,
              at: Date.now(),
            }),
          );
        }
        window.location.assign(data.checkoutUrl);
        return;
      }
      throw new Error("Missing checkoutUrl in response");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-300">
      <PageHeader
        title="Simulation"
        description="Run a quick payment simulation against your configured gateway."
      />

      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <Input
                name="apiKey"
                placeholder="Your API key"
                value={form.apiKey}
                onChange={handleChange}
                className="h-11 border-border/80 shadow-none"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">API Secret</label>
              <Input
                type="password"
                name="apiSecret"
                placeholder="Your API secret"
                value={form.apiSecret}
                onChange={handleChange}
                className="h-11 border-border/80 shadow-none"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                name="amount"
                placeholder="e.g. 100"
                value={form.amount}
                onChange={handleChange}
                className="h-11 border-border/80 shadow-none"
                min={0}
                step="any"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Invoice ID</label>
              <div className="flex gap-2">
                <Input
                  name="invoiceId"
                  placeholder="Optional (auto-generated if empty)"
                  value={form.invoiceId}
                  onChange={handleChange}
                  className="h-11 border-border/80 shadow-none"
                  autoComplete="off"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-11 shrink-0"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      invoiceId: generateInvoiceId(),
                    }))
                  }
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Gateway</label>
              <select
                name="gateway"
                value={form.gateway}
                onChange={handleChange}
                className={cn(
                  "h-11 w-full rounded-md border border-border/80 bg-background px-3 text-sm shadow-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                )}
              >
                <option value="localpay">LocalPay</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="submit" size="lg" disabled={loading} className="h-11">
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </form>

        {error ? (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {response ? (
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Response
            </p>
            <pre className="overflow-x-auto rounded-xl border border-border/70 bg-muted/30 p-4 text-xs leading-relaxed">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}
