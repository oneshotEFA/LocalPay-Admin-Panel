"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  Globe,
  KeyRound,
  LifeBuoy,
  ListChecks,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Terminal,
  Webhook,
  BookOpen,
  Zap,
  ArrowRight,
  Server,
  MousePointerClick,
  Hash,
  Clock,
  AlertCircle,
  FileCode2,
  Settings2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";

import { buttonVariants } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1.5 rounded-md border border-border/60 bg-background/60 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-500" /> Copied
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" /> Copy
        </>
      )}
    </button>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({
  icon: Icon,
  title,
  description,
  badge,
}: {
  icon: typeof BookOpen;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-muted/60 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {badge && (
          <Badge variant="outline" className="text-xs">
            {badge}
          </Badge>
        )}
      </div>
      <p className="pl-11 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

// ─── Code Block ───────────────────────────────────────────────────────────────
function CodeBlock({
  title,
  badge,
  children,
  className,
}: {
  title: string;
  badge: string;
  children: string;
  className?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
      <div className="flex items-center justify-between border-b border-border/70 bg-muted/50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-primary/25 bg-primary/10 text-primary text-[10px] px-1.5"
          >
            {badge}
          </Badge>
          <span className="text-xs font-medium text-muted-foreground">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={children} />
          <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
      <pre
        className={cn(
          "overflow-x-auto bg-[color-mix(in_oklab,var(--card)_82%,black_18%)] p-4 text-xs leading-6 text-[color-mix(in_oklab,var(--foreground)_88%,white_12%)] dark:bg-[color-mix(in_oklab,var(--card)_70%,black_30%)]",
          className,
        )}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

// ─── Flow Step ────────────────────────────────────────────────────────────────
function FlowStep({
  step,
  title,
  description,
  tag,
  last,
}: {
  step: number;
  title: string;
  description: string;
  tag?: string;
  last?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {step}
        </div>
        {!last && <div className="mt-2 h-full w-px bg-border/60" />}
      </div>
      <div className={cn("pb-6 space-y-1", last && "pb-0")}>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold">{title}</p>
          {tag && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          )}
        </div>
        <p className="text-xs leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// ─── Alert ────────────────────────────────────────────────────────────────────
function Alert({
  type,
  children,
}: {
  type: "warning" | "info" | "danger";
  children: React.ReactNode;
}) {
  const styles = {
    warning:
      "border-amber-500/30 bg-amber-500/8 text-amber-700 dark:text-amber-400",
    info: "border-primary/30 bg-primary/8 text-primary",
    danger: "border-red-500/30 bg-red-500/8 text-red-700 dark:text-red-400",
  };
  const Icon = type === "info" ? AlertCircle : AlertTriangle;
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-4 text-xs leading-6",
        styles[type],
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────────
function FieldRow({
  name,
  type,
  required,
  description,
}: {
  name: string;
  type: string;
  required: boolean;
  description: string;
}) {
  return (
    <tr className="border-b border-border/50 last:border-0">
      <td className="py-2.5 pr-3 align-top">
        <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-foreground">
          {name}
        </code>
      </td>
      <td className="py-2.5 pr-3 align-top">
        <span className="text-[11px] text-muted-foreground font-mono">
          {type}
        </span>
      </td>
      <td className="py-2.5 pr-3 align-top">
        {required ? (
          <Badge className="bg-primary/15 text-primary border-primary/20 text-[10px] px-1.5 py-0 font-normal">
            required
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 font-normal text-muted-foreground"
          >
            optional
          </Badge>
        )}
      </td>
      <td className="py-2.5 align-top text-xs leading-6 text-muted-foreground">
        {description}
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CODE SNIPPETS
// ─────────────────────────────────────────────────────────────────────────────

const phpController = `<?php
namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Http;
use App\\Models\\Invoice;
use Log;

class LocalPayController extends Controller
{
    // ── 1. Create checkout and redirect the user ──────────────────────────
    public function createPayment(Request $request)
    {
        $invoice = Invoice::findOrFail($request->invoice_id);

        $response = Http::post('https://api.localpay.et/gateway/checkout', [
            'api_key'        => env('LOCALPAY_API_KEY'),
            'api_secret'     => env('LOCALPAY_API_SECRET'),
            'amount'         => $invoice->amount,           // ETB, positive number
            'invoice_id'     => (string) $invoice->id,      // your unique order ID (idempotency key)
            'userId'         => (string) auth()->id(),      // your platform user ID
            'product_name'   => $invoice->description,
            'customer_name'  => auth()->user()->name,
            'customer_email' => auth()->user()->email,
            'webhook_url'    => route('localpay.webhook'),
            'success_url'    => route('localpay.success', $invoice->id),
            'cancel_url'     => route('localpay.cancel',  $invoice->id),
            'failed_url'     => route('localpay.failed',  $invoice->id),
            // 'expires_in_seconds' => 1800,  // optional, default 30 min
        ]);

        if ($response->successful()) {
            $data = $response->json();

            if (
                isset($data['status'], $data['checkoutID'], $data['checkoutUrl'])
                && $data['status'] === 'success'
            ) {
                // Save checkoutID so you can match it when the webhook arrives
                $invoice->update(['localpay_checkout_id' => $data['checkoutID']]);

                // Redirect user to LocalPay hosted deposit portal
                return redirect()->to($data['checkoutUrl']);
            }

            return back()->withErrors(['payment' => $data['message'] ?? 'Checkout creation failed.']);
        }

        Log::error('LocalPay createPayment failed', ['body' => $response->body()]);
        return back()->withErrors(['payment' => 'Could not reach payment gateway. Please try again.']);
    }

    // ── 2. Receive the payment confirmation webhook ───────────────────────
    // LocalPay POSTs here once deposit is OCR-verified. This is your
    // authoritative payment signal — not the success redirect.
    public function webhook(Request $request)
    {
        Log::info('LocalPay webhook', $request->all());

        // Validate required fields
        if (
            ! $request->filled(['TrxID', 'CheckoutID', 'InvoiceID', 'Status'])
            || $request->Status !== 'Paid'
        ) {
            return response()->json(['error' => 'Invalid payload'], 400);
        }

        $invoice = Invoice::find($request->InvoiceID);

        if (! $invoice) {
            Log::warning('LocalPay webhook: invoice not found', ['InvoiceID' => $request->InvoiceID]);
            return response()->json(['error' => 'Invoice not found'], 404);
        }

        // Guard against double-processing (webhook delivers at least once)
        if ($invoice->invoice_status === 'Paid') {
            return response()->json(['status' => 'already_processed'], 200);
        }

        // Verify checkoutID matches what you saved in createPayment
        if ($invoice->localpay_checkout_id !== $request->CheckoutID) {
            Log::warning('LocalPay webhook: CheckoutID mismatch', [
                'expected' => $invoice->localpay_checkout_id,
                'got'      => $request->CheckoutID,
            ]);
            return response()->json(['error' => 'CheckoutID mismatch'], 400);
        }

        // Mark invoice paid
        $invoice->update([
            'invoice_status'  => 'Paid',
            'localpay_trx_id' => $request->TrxID,
            'paid_at'         => now(),
        ]);

        // ↓ Add your own fulfillment logic here
        // e.g. credit user balance, activate plan, send receipt email
        // $invoice->user->increment('balance', $invoice->amount);

        // Respond 200 fast — LocalPay retries on timeout or non-2xx
        return response()->json(['status' => 'ok'], 200);
    }

    // ── 3. Redirect handlers (UX only — no fulfillment here) ─────────────
    public function success($invoiceId)
    {
        // Redirect fires before webhook in most cases — show a "processing" state.
        // Poll your own order status endpoint, or just tell the user to wait.
        $invoice = Invoice::findOrFail($invoiceId);
        return view('payment.processing', compact('invoice'));
    }

    public function cancel($invoiceId)
    {
        return redirect()->route('checkout.show', $invoiceId)
                         ->withErrors(['payment' => 'Payment was cancelled.']);
    }

    public function failed($invoiceId)
    {
        return redirect()->route('checkout.show', $invoiceId)
                         ->withErrors(['payment' => 'Verification failed. Please try again with a valid receipt.']);
    }
}`;

const phpRoutes = `<?php
// routes/web.php

use App\\Http\\Controllers\\LocalPayController;

// Triggers createPayment() — called by the Pay button form
Route::post('/payment/create', [LocalPayController::class, 'createPayment'])
    ->name('localpay.create')
    ->middleware('auth');

// Webhook — called by LocalPay server after deposit is verified
// ⚠️  Must be excluded from CSRF (see VerifyCsrfToken.php)
Route::post('/payment/webhook/localpay', [LocalPayController::class, 'webhook'])
    ->name('localpay.webhook');

// Redirect targets after checkout portal
Route::get('/payment/success/{invoiceId}', [LocalPayController::class, 'success'])
    ->name('localpay.success');
Route::get('/payment/cancel/{invoiceId}',  [LocalPayController::class, 'cancel'])
    ->name('localpay.cancel');
Route::get('/payment/failed/{invoiceId}',  [LocalPayController::class, 'failed'])
    ->name('localpay.failed');`;

const phpCsrf = `<?php
// app/Http/Middleware/VerifyCsrfToken.php
// LocalPay's server can't send a CSRF token — exempt the webhook route.

namespace App\\Http\\Middleware;

use Illuminate\\Foundation\\Http\\Middleware\\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    protected $except = [
        'payment/webhook/localpay',  // ← add this
    ];
}`;

const phpEnv = `# .env — add these two lines
# Never commit .env to Git.

LOCALPAY_API_KEY=lp_live_xxxxxxxxxxxxxxxx
LOCALPAY_API_SECRET=lp_secret_xxxxxxxxxxxxxxxx

APP_URL=https://yourdomain.com   # make sure this is your real public domain`;

const htaccess = `# .htaccess — alternative for cPanel shared hosting
# Place inside your Laravel public/ folder (or project root if that's your document root).
# Use this if you can't edit .env directly on your server.

SetEnv LOCALPAY_API_KEY     lp_live_xxxxxxxxxxxxxxxx
SetEnv LOCALPAY_API_SECRET  lp_secret_xxxxxxxxxxxxxxxx

# After adding, run: php artisan config:clear
# If no terminal: delete bootstrap/cache/config.php via cPanel File Manager`;

const phpMigration = `<?php
// php artisan make:migration add_localpay_fields_to_invoices_table
// Then add these columns:

Schema::table('invoices', function (Blueprint $table) {
    $table->string('localpay_checkout_id')->nullable(); // stores checkoutID for webhook matching
    $table->string('localpay_trx_id')->nullable();      // stores TrxID from webhook
    $table->timestamp('paid_at')->nullable();
    // invoice_status column should already exist with 'Paid' as a valid value
});`;

const bladeButton = `{{-- resources/views/checkout/show.blade.php --}}
{{-- A plain HTML form — no JS required. Style with your existing CSS. --}}

<form method="POST" action="{{ route('localpay.create') }}">
    @csrf
    <input type="hidden" name="invoice_id" value="{{ $invoice->id }}">

    <button
        type="submit"
        class="btn btn-primary"
        {{ $invoice->invoice_status === 'Paid' ? 'disabled' : '' }}
    >
        @if ($invoice->invoice_status === 'Paid')
            ✓ Already Paid
        @else
            Pay {{ number_format($invoice->amount, 2) }} ETB with LocalPay
        @endif
    </button>
</form>

{{-- Show any payment errors --}}
@error('payment')
    <p class="text-danger mt-2">{{ $message }}</p>
@enderror`;

const webhookPayload = `// LocalPay POSTs this JSON body to your webhook_url
// after deposit passes OCR verification.

{
    "TrxID":      "FT24213XXXXX",
    "CheckoutID": "ea10a56c-fe4f-460c-a854-9e1a3221b120",
    "InvoiceID":  "1042",
    "Status":     "Paid",
    "Amount":     500
}

// TrxID      — the actual bank transaction reference
// CheckoutID — matches the checkoutID you stored during createPayment
// InvoiceID  — the invoice_id you sent us in the checkout request
// Status     — always "Paid" for successful deposits
// Amount     — verified deposit amount in ETB`;

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function IntegrationPage() {
  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      <PageHeader
        title="Integration Guide"
        description="Complete setup for Laravel apps hosted on cPanel — controller, routes, CSRF config, the Pay button, and webhook handling."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/settings"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-1.5",
              )}
            >
              Account settings <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/api-keys"
              className={cn(buttonVariants({ size: "lg" }), "gap-1.5")}
            >
              Get API keys <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        }
      />

      {/* ── Status banner ──────────────────────────────────────────────── */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="border-b border-border/70 bg-muted/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                  Active
                </Badge>
                <Badge variant="outline">Laravel · PHP</Badge>
                <Badge variant="outline">cPanel compatible</Badge>
                <Badge variant="outline">Hosted checkout</Badge>
                <Badge variant="outline">Webhook verified</Badge>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight">
                  LocalPay Gateway
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  A hosted payment gateway for Ethiopian bank deposits — CBE,
                  Telebirr, Bank of Abyssinia, NIB, and eBirr. This guide is
                  written for{" "}
                  <strong className="text-foreground">
                    Laravel applications hosted on cPanel
                  </strong>
                  . Your controller creates a checkout session, redirects the
                  customer to LocalPay, and a webhook fires back to your server
                  once the deposit is verified.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Endpoint
                </p>
                <div className="mt-2 flex items-center gap-2 font-mono text-sm font-medium">
                  <Server className="h-4 w-4 shrink-0 text-primary" />
                  POST /gateway/checkout
                </div>
              </div>
              <div className="rounded-xl border border-border/70 bg-background px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Session TTL
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-primary" />
                  30 min default · configurable
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <SectionHeading
            icon={BookOpen}
            title="How the payment flow works"
            description="End-to-end lifecycle — from your Laravel controller initiating a session to the webhook crediting the user."
          />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Server,
                step: "1 · Your Laravel controller",
                body: "createPayment() calls POST /gateway/checkout with credentials + order data. LocalPay returns a checkoutUrl. You store the checkoutID and redirect($checkoutUrl).",
              },
              {
                icon: MousePointerClick,
                step: "2 · LocalPay deposit portal",
                body: "The user picks a bank, makes the transfer, then submits their receipt (screenshot, SMS, or link). LocalPay OCR-verifies the proof against the expected amount and receiver account.",
              },
              {
                icon: Webhook,
                step: "3 · Webhook to your server",
                body: "On verified payment, LocalPay POSTs to your webhook_url with TrxID, CheckoutID, InvoiceID, and Status=Paid. Your webhook() method marks the invoice paid and credits the user.",
              },
            ].map(({ icon: Icon, step, body }) => (
              <div
                key={step}
                className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  <p className="text-sm font-semibold">{step}</p>
                </div>
                <p className="text-xs leading-6 text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>

          {/* Flow diagram */}
          <div className="rounded-xl border border-border/70 bg-muted/10 p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Request flow
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                {
                  label: "User clicks Pay",
                  sub: "Blade form POST",
                  c: "bg-primary/15 text-primary border-primary/25",
                },
                null,
                {
                  label: "createPayment()",
                  sub: "your controller",
                  c: "bg-primary/15 text-primary border-primary/25",
                },
                null,
                {
                  label: "LocalPay API",
                  sub: "returns checkoutUrl",
                  c: "bg-muted border-border/70",
                },
                null,
                {
                  label: "redirect($url)",
                  sub: "Laravel redirect",
                  c: "bg-primary/15 text-primary border-primary/25",
                },
                null,
                {
                  label: "User deposits",
                  sub: "LocalPay portal",
                  c: "bg-muted border-border/70",
                },
                null,
                {
                  label: "OCR verified ✓",
                  sub: "fires webhook POST",
                  c: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
                },
                null,
                {
                  label: "webhook()",
                  sub: "mark invoice Paid",
                  c: "bg-primary/15 text-primary border-primary/25",
                },
              ].map((item, i) =>
                item === null ? (
                  <ArrowRight
                    key={i}
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                  />
                ) : (
                  <div
                    key={i}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-center",
                      item.c,
                    )}
                  >
                    <p className="font-semibold">{item.label}</p>
                    <p className="mt-0.5 text-[10px] opacity-70">{item.sub}</p>
                  </div>
                ),
              )}
            </div>
          </div>

          <Alert type="danger">
            <strong>Never fulfill an order in the success redirect.</strong> The{" "}
            <code>success_url</code> redirect fires before verification
            completes and can be triggered manually. Your <code>webhook()</code>{" "}
            method is the only reliable payment signal. Always mark invoices
            paid there.
          </Alert>
        </CardContent>
      </Card>

      {/* ── Setup Checklist + Env ─────────────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <SectionHeading
              icon={ListChecks}
              title="Setup checklist"
              description="Complete these steps once before your first live transaction."
            />
          </CardHeader>
          <CardContent className="pt-2">
            <FlowStep
              step={1}
              title="Get your API credentials"
              tag="Client portal"
              description="In this portal go to API Keys and create a key pair. Copy both the key and secret — the secret is shown only once. Store them securely, never in version control."
            />
            <FlowStep
              step={2}
              title="Add credentials to .env (or .htaccess)"
              tag="cPanel / .env"
              description="Add LOCALPAY_API_KEY and LOCALPAY_API_SECRET to your .env. On shared cPanel hosting without SSH, use SetEnv in .htaccess instead. See the Environment section below."
            />
            <FlowStep
              step={3}
              title="Add LocalPayController to your app"
              tag="app/Http/Controllers"
              description="Copy the full controller from the Backend Code section into app/Http/Controllers/LocalPayController.php. Adjust the Invoice model and field names to match your schema."
            />
            <FlowStep
              step={4}
              title="Register the five routes"
              tag="routes/web.php"
              description="Add the create, webhook, success, cancel, and failed routes to routes/web.php. The webhook route must be outside the auth middleware group."
            />
            <FlowStep
              step={5}
              title="Exempt webhook from CSRF"
              tag="VerifyCsrfToken.php"
              description="LocalPay's server cannot send a CSRF token. Add 'payment/webhook/localpay' to the \$except array in app/Http/Middleware/VerifyCsrfToken.php. Without this, every webhook returns 419 and invoices never get marked paid."
            />
            <FlowStep
              step={6}
              title="Run the migration"
              tag="Database"
              description="Add localpay_checkout_id and localpay_trx_id columns to your invoices table using the migration snippet below. These link the webhook event back to the correct order."
            />
            <FlowStep
              step={7}
              title="Add the Pay button to your Blade view"
              tag="Blade template"
              description="Paste the form + button from the Frontend section into your checkout view. The only required hidden field is invoice_id."
            />
            <FlowStep
              step={8}
              title="Test end-to-end in sandbox"
              tag="Testing"
              last
              description="Use sandbox credentials to run a full cycle without real money. Watch storage/logs/laravel.log to confirm the webhook arrives, the CheckoutID matches, and invoice_status becomes Paid."
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <SectionHeading
                icon={Settings2}
                title="Environment variables"
                description="How to set your credentials on cPanel and in Laravel."
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock title=".env file (recommended)" badge=".ENV">
                {phpEnv}
              </CodeBlock>
              <CodeBlock
                title=".htaccess — cPanel alternative"
                badge=".HTACCESS"
              >
                {htaccess}
              </CodeBlock>
              <Alert type="warning">
                <strong>cPanel:</strong> After editing <code>.env</code>, flush
                the config cache with <code>php artisan config:clear</code> via
                cPanel Terminal or SSH. No terminal? Delete{" "}
                <code>bootstrap/cache/config.php</code> through cPanel File
                Manager.
              </Alert>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <SectionHeading
                icon={FileCode2}
                title="Database migration"
                description="Extra columns your invoices table needs for webhook reconciliation."
              />
            </CardHeader>
            <CardContent>
              <CodeBlock
                title="add_localpay_fields_to_invoices_table"
                badge="MIGRATION"
              >
                {phpMigration}
              </CodeBlock>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Request fields ────────────────────────────────────────────────── */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <SectionHeading
            icon={Hash}
            title="Checkout request fields"
            description="All fields accepted by POST /gateway/checkout. Pass these from your LocalPayController::createPayment method."
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-border/70">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/70 bg-muted/40">
                  {["Field", "Type", "Required", "Description"].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {(
                  [
                    [
                      "api_key",
                      "string",
                      true,
                      "Your API key from this portal.",
                    ],
                    [
                      "api_secret",
                      "string",
                      true,
                      "Your API secret. Controller-only — never in Blade or JS.",
                    ],
                    [
                      "amount",
                      "number",
                      true,
                      "Deposit amount in ETB. Positive number.",
                    ],
                    [
                      "invoice_id",
                      "string",
                      true,
                      "Your unique order ID. Idempotency key — safe to retry with the same value.",
                    ],
                    [
                      "userId",
                      "string",
                      true,
                      "Your platform's user ID for this customer.",
                    ],
                    [
                      "product_name",
                      "string",
                      true,
                      "Label shown on the checkout page.",
                    ],
                    ["customer_name", "string", true, "Customer's full name."],
                    [
                      "customer_email",
                      "email",
                      true,
                      "Customer's email address.",
                    ],
                    [
                      "webhook_url",
                      "url",
                      true,
                      "Public URL on your server. LocalPay POSTs here after verification. Must not require auth or CSRF.",
                    ],
                    [
                      "success_url",
                      "url",
                      true,
                      "Where to redirect the user after a successful deposit.",
                    ],
                    [
                      "cancel_url",
                      "url",
                      true,
                      "Where to redirect if the user cancels.",
                    ],
                    [
                      "failed_url",
                      "url",
                      true,
                      "Where to redirect if verification fails.",
                    ],
                    [
                      "expires_in_seconds",
                      "integer",
                      false,
                      "Session TTL. Minimum 60. Defaults to 1800 (30 min).",
                    ],
                  ] as [string, string, boolean, string][]
                ).map(([n, t, r, d]) => (
                  <FieldRow
                    key={n}
                    name={n}
                    type={t}
                    required={r}
                    description={d}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <Alert type="info">
            <strong>Idempotency:</strong> Calling the endpoint twice with the
            same <code>invoice_id</code> while the session is still active
            returns the same <code>checkoutUrl</code> unchanged — no duplicate
            session created. Safe to retry on network failure.
          </Alert>
        </CardContent>
      </Card>

      {/* ── Backend code ──────────────────────────────────────────────────── */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <SectionHeading
            icon={FileCode2}
            title="Backend code"
            description="Copy these three files into your Laravel app. Adjust model names and column names to match your own schema."
            badge="PHP · Laravel"
          />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">
              <code className="rounded bg-muted px-1.5 text-foreground">
                app/Http/Controllers/LocalPayController.php
              </code>
            </h3>
            <p className="text-xs leading-6 text-muted-foreground">
              Four methods:{" "}
              <code className="rounded bg-muted px-1 text-foreground">
                createPayment
              </code>{" "}
              initiates the checkout,{" "}
              <code className="rounded bg-muted px-1 text-foreground">
                webhook
              </code>{" "}
              handles the verified payment event, and{" "}
              <code className="rounded bg-muted px-1 text-foreground">
                success / cancel / failed
              </code>{" "}
              handle post-checkout redirects.
            </p>
          </div>
          <CodeBlock title="LocalPayController.php — full file" badge="PHP">
            {phpController}
          </CodeBlock>

          <Separator />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">
                <code className="rounded bg-muted px-1.5 text-foreground">
                  routes/web.php
                </code>
              </h3>
              <CodeBlock title="Five routes to register" badge="PHP">
                {phpRoutes}
              </CodeBlock>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">
                <code className="rounded bg-muted px-1.5 text-foreground">
                  app/Http/Middleware/VerifyCsrfToken.php
                </code>
              </h3>
              <CodeBlock title="Exempt webhook from CSRF" badge="PHP">
                {phpCsrf}
              </CodeBlock>
              <Alert type="danger">
                <strong>Do not skip this.</strong> Without the CSRF exemption,
                Laravel will return <code>419 Page Expired</code> for every
                webhook and your invoices will never be marked as paid.
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Frontend blade button ─────────────────────────────────────────── */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <SectionHeading
            icon={MousePointerClick}
            title="Frontend — the Pay button"
            description="A plain HTML form in your Blade view. No JavaScript required. Style it with Bootstrap, Tailwind, or any CSS you already use."
            badge="Blade template"
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <CodeBlock
              title="resources/views/checkout/show.blade.php"
              badge="BLADE"
            >
              {bladeButton}
            </CodeBlock>
            <div className="space-y-4">
              <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3">
                <p className="text-sm font-semibold">
                  What happens after submit
                </p>
                <div className="space-y-2.5">
                  {[
                    "Form POSTs to your createPayment() route with the invoice ID.",
                    "Your controller calls the LocalPay API and gets back a checkoutUrl.",
                    "Laravel does redirect($checkoutUrl) — user lands on LocalPay portal.",
                    "User selects bank, deposits the exact amount, submits receipt proof.",
                    "LocalPay OCR-verifies the proof and fires your webhook on success.",
                    "Your webhook() marks the invoice Paid and credits the user.",
                    "User is redirected to your success_url (UX only — not the source of truth).",
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-xs leading-6 text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <Alert type="info">
                The button is intentionally a plain <code>&lt;form&gt;</code> —
                no extra dependencies needed. Pass <code>invoice_id</code> as a
                hidden field. You can add a spinner with a small{" "}
                <code>onsubmit</code> listener if you want UX feedback during
                the redirect.
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Webhook section ───────────────────────────────────────────────── */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <SectionHeading
            icon={Webhook}
            title="Webhook — receiving payment confirmation"
            description="LocalPay POSTs to your webhook_url after OCR verification passes. This is the only authoritative payment signal."
          />
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert type="danger">
            <strong>
              Fulfill orders in the webhook only — not in the success redirect.
            </strong>{" "}
            The redirect fires first and can be triggered manually. The webhook
            is the reliable signal.
          </Alert>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <CodeBlock
                title="Payload LocalPay sends to your webhook_url"
                badge="JSON"
              >
                {webhookPayload}
              </CodeBlock>

              <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3">
                <p className="text-sm font-semibold">Delivery rules</p>
                <div className="space-y-2.5">
                  {[
                    { icon: Zap, text: "Fires once per verified deposit." },
                    {
                      icon: RefreshCw,
                      text: "Retried with backoff on non-2xx or timeout.",
                    },
                    {
                      icon: Hash,
                      text: "At-least-once — guard against double-processing by checking invoice_status.",
                    },
                    {
                      icon: Clock,
                      text: "Respond 200 within 5 s. Queue heavy work.",
                    },
                    {
                      icon: ShieldCheck,
                      text: "Verify both InvoiceID and CheckoutID to prevent spoofing.",
                    },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-start gap-2.5 text-xs leading-6 text-muted-foreground"
                    >
                      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3">
                <p className="text-sm font-semibold">
                  Webhook implementation checklist
                </p>
                {[
                  "Route registered in routes/web.php",
                  "Path added to VerifyCsrfToken $except array",
                  "Endpoint is publicly reachable from the internet",
                  "Returns HTTP 200 within 5 seconds",
                  "Validates TrxID, CheckoutID, InvoiceID, Status fields",
                  "Returns 200 early if invoice is already Paid (idempotency)",
                  "Verifies CheckoutID against localpay_checkout_id you stored",
                  "All fulfillment logic (credit user, activate plan, etc.) is here",
                  "Not in the success_url redirect handler",
                ].map((s) => (
                  <div
                    key={s}
                    className="flex items-start gap-2.5 text-xs leading-6 text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    {s}
                  </div>
                ))}
              </div>
              <Alert type="warning">
                <strong>cPanel shared hosting:</strong> Your{" "}
                <code>webhook_url</code> must be your real public domain — not{" "}
                <code>localhost</code>. Test reachability with{" "}
                <strong>webhook.site</strong> before going live.
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Troubleshooting + FAQ ─────────────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <SectionHeading
              icon={LifeBuoy}
              title="Troubleshooting"
              description="Quick fixes for the most common cPanel + Laravel issues."
            />
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title: "Webhook returns 419 Page Expired",
                fix: "The webhook route is not in the $except array of VerifyCsrfToken.php. This is the most common issue. Add 'payment/webhook/localpay' to $except and deploy.",
              },
              {
                title: "401 Unauthorized from LocalPay API",
                fix: "api_key / api_secret mismatch or extra whitespace. After editing .env, run php artisan config:clear. If no terminal, delete bootstrap/cache/config.php via File Manager.",
              },
              {
                title: "Webhook never arrives",
                fix: "webhook_url must be your live public domain — not localhost or a private IP. Test it with webhook.site. Check cPanel firewall and Cloudflare rules that might block external POST requests.",
              },
              {
                title: "'Checkout session expired' error for users",
                fix: "The 30-min TTL elapsed. Pass a larger expires_in_seconds in createPayment(). Or call createPayment() again with the same invoice_id to renew — the same invoice_id is safe to reuse.",
              },
              {
                title: "Invoice gets credited twice",
                fix: "LocalPay delivers at-least-once — webhook may fire more than once. Always check invoice_status === 'Paid' at the top of webhook() and return 200 immediately if already processed.",
              },
              {
                title: "createPayment() returns 'Something went wrong'",
                fix: "Check storage/logs/laravel.log. Common causes: wrong credentials, invoice already Paid, or validation error (bad URL format in webhook_url / success_url — must be full https:// URLs).",
              },
              {
                title: "env() returns null even though .env is set",
                fix: "Config cache is stale. Run php artisan config:clear. No terminal? Delete bootstrap/cache/config.php from cPanel File Manager. Also confirm .env is not committed to Git and being overwritten on deploy.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border/70 bg-muted/20 p-4"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      {item.fix}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <SectionHeading
              icon={RefreshCw}
              title="FAQ"
              description="Common questions from Laravel developers integrating LocalPay."
            />
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                q: "Can I put the API call in a Blade view or JS?",
                a: "No. api_secret must only be used in your PHP controller. Never include it in Blade templates, JavaScript, or any file served to the browser.",
              },
              {
                q: "What payment methods are supported?",
                a: "CBE (Commercial Bank of Ethiopia), Telebirr, Bank of Abyssinia (BOA), NIB Bank, and eBirr. Which methods appear on the checkout page depends on which receiving accounts you configure in the admin settings of this portal.",
              },
              {
                q: "What does the user actually do on the LocalPay checkout page?",
                a: "They select their bank and are shown the receiving account number. They make the transfer from their banking app, then submit proof — either a screenshot, a forwarded SMS, or a bank-provided transaction link. LocalPay OCR-verifies the proof automatically.",
              },
              {
                q: "What is the invoice_id idempotency guarantee exactly?",
                a: "For the same client + invoice_id, if an active (non-expired, non-paid) session exists, /gateway/checkout returns the same checkoutUrl. If it expired, a new session is created. This makes it safe to retry createPayment on network failure without creating duplicates.",
              },
              {
                q: "Do I need to verify any signature on the webhook?",
                a: "Currently LocalPay uses payload field matching (InvoiceID + CheckoutID cross-checked against your database). Always verify both fields. Webhook HMAC signature headers are on the roadmap.",
              },
              {
                q: "Can a user retry if their receipt is rejected?",
                a: "Yes. The checkout session allows multiple verification attempts before hard-failing. The session stays valid until expiry, so the user can re-submit with a correct receipt.",
              },
              {
                q: "Do I have to store localpay_checkout_id in the database?",
                a: "Yes — always. When the webhook fires, you match its CheckoutID against this saved value. Without it, there is no reliable way to link the webhook event to the correct invoice.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-border/70 bg-muted/20 px-4 py-3"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium">
                  <span>{item.q}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="pb-1 pt-3 text-xs leading-7 text-muted-foreground">
                  {item.a}
                </p>
              </details>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Supported banks ───────────────────────────────────────────────── */}
      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <SectionHeading
            icon={Globe}
            title="Supported banks & proof formats"
            description="LocalPay verifies deposits for these five Ethiopian banks and payment networks. Available methods depend on your active receiving accounts."
          />
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              {
                name: "CBE",
                full: "Commercial Bank of Ethiopia",
                methods: ["Screenshot (OCR)", "SMS", "Transaction link"],
                c: "border-blue-500/30 bg-blue-500/5",
                dot: "bg-blue-500",
              },
              {
                name: "Telebirr",
                full: "Telebirr Mobile Money",
                methods: ["Screenshot (OCR)", "SMS", "Transaction link"],
                c: "border-violet-500/30 bg-violet-500/5",
                dot: "bg-violet-500",
              },
              {
                name: "BOA",
                full: "Bank of Abyssinia",
                methods: ["Screenshot (OCR)", "SMS", "Transaction link"],
                c: "border-amber-500/30 bg-amber-500/5",
                dot: "bg-amber-500",
              },
              {
                name: "NIB",
                full: "NIB International Bank",
                methods: ["Screenshot (OCR)", "SMS", "Transaction link"],
                c: "border-emerald-500/30 bg-emerald-500/5",
                dot: "bg-emerald-500",
              },
              {
                name: "eBirr",
                full: "eBirr Digital Wallet",
                methods: ["Screenshot (OCR)", "SMS", "Transaction link"],
                c: "border-rose-500/30 bg-rose-500/5",
                dot: "bg-rose-500",
              },
            ].map((bank) => (
              <div
                key={bank.name}
                className={cn("rounded-xl border p-4 space-y-3", bank.c)}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", bank.dot)} />
                  <p className="text-sm font-semibold">{bank.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{bank.full}</p>
                <div className="space-y-1">
                  {bank.methods.map((m) => (
                    <div
                      key={m}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <Check className="h-3 w-3 shrink-0 text-emerald-500" />{" "}
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
