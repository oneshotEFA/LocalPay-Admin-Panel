"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { mockAdminConfig } from "@/lib/mock/data";
import { mockClientProfile } from "@/lib/mock/client";
import { Activity, Bell, FileText, ShieldCheck, Zap, Globe, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
// import { useSettings, useUpdateWebhook, useUpdateBranding, useUpdateNotifications, useTestWebhook } from "@/lib/api"; // ← connect when ready

const notifDefaults = [
  { id: "notif-verification", label: "Deposit verifications", description: "Email when a deposit is verified or needs review.", channel: "Email", enabled: true },
  { id: "notif-funds",        label: "Funded transactions",  description: "Push notification once a transaction settles.",    channel: "Webhook", enabled: true },
  { id: "notif-receipt",      label: "Receipt failures",     description: "Alert when submitted proof can't be parsed.",      channel: "SMS",     enabled: false },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(notifDefaults);
  const [webhookUrl, setWebhookUrl] = useState(mockClientProfile.webhookUrl ?? "");
  const [savingWebhook, setSavingWebhook] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);

  const statCards = [
    { label: "Checkouts", value: mockClientProfile.stats.totalCheckoutsMonth, icon: Activity },
    { label: "Deposits",  value: mockClientProfile.stats.totalDepositsMonth,  icon: FileText },
    { label: "Funded",    value: `${mockClientProfile.stats.totalFundedMonth.toLocaleString()} ETB`, icon: ShieldCheck },
    { label: "Attention", value: mockClientProfile.stats.pendingAttention, icon: Bell, alert: true },
  ];

  const groupedConfigs = useMemo(() => {
    const map = new Map<string, typeof mockAdminConfig>();
    mockAdminConfig.forEach((c) => {
      const g = c.group ?? "general";
      map.set(g, [...(map.get(g) ?? []), c]);
    });
    return Array.from(map.entries());
  }, []);

  const handleSaveWebhook = async () => {
    setSavingWebhook(true);
    await new Promise((r) => setTimeout(r, 600));
    setSavingWebhook(false);
    toast.success("Webhook URL saved");
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    await new Promise((r) => setTimeout(r, 900));
    setTestingWebhook(false);
    toast.success("Test ping sent — got 200 OK");
  };

  const toggleNotif = (id: string) =>
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, enabled: !n.enabled } : n));

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your portal configuration, webhooks, and notification preferences.</p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label} className={`border shadow-sm ${s.alert ? "border-rose-200 bg-rose-50/30" : "border-slate-200"}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className={`text-xs font-medium uppercase tracking-wide ${s.alert ? "text-rose-500" : "text-slate-500"}`}>{s.label}</p>
                <s.icon className={`h-4 w-4 ${s.alert ? "text-rose-400" : "text-slate-400"}`} />
              </div>
              <p className={`text-2xl font-bold ${s.alert ? "text-rose-700" : "text-slate-900"}`}>{s.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Webhooks */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-400" />Webhook Endpoint
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500 uppercase tracking-wide">Webhook URL</Label>
              <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.yourapp.com/webhook"
                className="font-mono text-sm border-slate-200 bg-white" />
              <p className="text-xs text-slate-400">Payloads fire on VERIFIED, FUNDED, and REJECTED_HARD transitions.</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-none gap-1 text-xs">
                <CheckCircle2 className="w-3 h-3" />200 OK
              </Badge>
              <span className="text-xs text-slate-400">Last checked just now</span>
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleSaveWebhook} disabled={savingWebhook} className="bg-slate-900 hover:bg-slate-800 text-white h-8">
                {savingWebhook ? <><Loader2 className="mr-1.5 h-3 w-3 animate-spin" />Saving…</> : "Save"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleTestWebhook} disabled={testingWebhook} className="h-8 border-slate-200 text-slate-600">
                {testingWebhook ? <><Loader2 className="mr-1.5 h-3 w-3 animate-spin" />Testing…</> : <><Zap className="mr-1.5 h-3 w-3" />Send Test</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-slate-400" />Portal Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-slate-600">{mockClientProfile.name[0]}</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{mockClientProfile.name}</p>
                <p className="text-xs text-slate-400 font-mono">/{mockClientProfile.slug}</p>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <p className="text-xs text-slate-500 font-medium">Client ID</p>
              <code className="text-xs font-mono text-slate-700 select-all">client-1234-5678</code>
            </div>
            <p className="text-xs text-slate-400">Contact support to update your portal name or logo.</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-slate-400" />Notification Routing</div>
            <Badge className="text-[10px] bg-slate-100 text-slate-500 border-slate-200 shadow-none">Managed</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-slate-800">{n.label}</p>
                  <Badge className="text-[10px] bg-slate-100 text-slate-500 border-slate-200 shadow-none">{n.channel}</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{n.description}</p>
              </div>
              <Switch checked={n.enabled} onCheckedChange={() => toggleNotif(n.id)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Admin config */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-800">Admin Config Values</CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          {groupedConfigs.map(([group, configs]) => (
            <div key={group}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{group}</p>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                {configs.map((c, i) => (
                  <div key={c.id} className={`flex items-center justify-between px-4 py-3 text-sm ${i < configs.length - 1 ? "border-b border-slate-100" : ""}`}>
                    <div>
                      <p className="font-medium text-slate-800">{c.label ?? c.key}</p>
                      <p className="text-xs font-mono text-slate-400">{c.key}</p>
                    </div>
                    <Badge className="text-xs bg-slate-100 text-slate-700 border-slate-200 shadow-none font-mono">{c.value}</Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
