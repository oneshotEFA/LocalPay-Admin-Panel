"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  KeyRound,
  ListChecks,
  BookOpen,
  ArrowRight,
  Upload,
  Cpu,
  FileCode2,
  Settings2,
  Building2,
  CheckCircle2,
  ExternalLink,
  Download,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { buttonVariants } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

// ─── Utility Components ──────────────────────────────────────────────────────
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
        <Check className="h-3 w-3 text-emerald-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-muted/60 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      <p className="pl-11 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function RepoFileLink({
  title,
  path,
  href,
}: {
  title: string;
  path: string;
  href: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card transition-all hover:border-primary/50">
      <div className="flex items-center justify-between border-b border-border/70 bg-muted/50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] px-1.5 bg-background">
            FILE
          </Badge>
          <span className="text-xs font-medium text-muted-foreground">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={path} />
          <Link
            href={href}
            target="_blank"
            className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <ExternalLink className="h-3 w-3" /> OPEN CODE
          </Link>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FileCode2 className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Server Destination Path:
            </p>
            <code className="text-xs font-mono text-foreground">{path}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function DhruIntegrationPage() {
  const repoBase =
    "https://github.com/oneshotEFA/LocalPay-Cpanel-Gateway-Scripts/blob/main";

  const supportedBanks = [
    "Commercial Bank of Ethiopia (CBE)",
    "Telebirr",
    "Bank of Abyssinia",
    "NIB International Bank",
    "eBirr / Hibret Bank",
    "Dashen Bank (Amole)",
  ];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      <PageHeader
        title="DHRU Payment Gateway Integration"
        description="Connect your DHRU system to LocalPay using our optimized cPanel scripts."
        action={
          <Link
            href="https://github.com/oneshotEFA/LocalPay-Cpanel-Gateway-Scripts/archive/refs/heads/main.zip"
            className={cn(buttonVariants({ variant: "default" }), "gap-2")}
          >
            <Download className="h-4 w-4" /> Download All Scripts
          </Link>
        }
      />

      {/* ── Supported Banks ── */}
      <Card className="border-border/70 shadow-sm overflow-hidden">
        <div className="bg-primary/5 border-b border-border/70 px-6 py-4 flex items-center gap-3">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Supported Payment Methods</h3>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {supportedBanks.map((bank) => (
              <div
                key={bank}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-muted/20"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">{bank}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Step 1: Upload ── */}
        <div className="space-y-6">
          <SectionHeading
            icon={Upload}
            title="1. Upload Scripts"
            description="Open each file below to copy the code, then upload to these specific server paths."
          />
          <div className="space-y-4">
            <RepoFileLink
              title="localpay.php"
              path="/module/gateway/localpay.php"
              href={`${repoBase}/Localpay.php`}
            />
            <RepoFileLink
              title="callback.php"
              path="/public_html/callback.php"
              href={`${repoBase}/Localpay_callback.php`}
            />
          </div>
        </div>

        {/* ── Step 2: Configure ── */}
        <div className="space-y-6">
          <SectionHeading
            icon={Settings2}
            title="2. DHRU Gateway Settings"
            description="Input your API credentials into the admin panel."
          />
          <Card className="border-border/70 bg-card">
            <CardContent className="space-y-4 pt-6">
              <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-muted-foreground">
                  <ListChecks className="h-3 w-3" /> Navigation Path
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="text-primary">Payments</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-primary">Gateway</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-foreground font-bold underline decoration-primary/30 underline-offset-4">
                    LocalPay
                  </span>
                </div>
              </div>
              <div className="space-y-4 rounded-xl border border-border/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the <strong>API Key</strong> and{" "}
                    <strong>Secret Key</strong> you already received.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    <Check className="h-3 w-3" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set the status to <strong>Active</strong> and Currency to{" "}
                    <strong>ETB</strong>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Final Check ── */}
    </div>
  );
}
