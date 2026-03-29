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
import { Activity, Bell, FileText, ShieldCheck } from "lucide-react";

const notificationDefaults = [
  {
    id: "notif-verification",
    label: "Deposit verifications",
    description: "Email when a deposit is verified or requires review.",
    channel: "Email",
    enabled: true,
  },
  {
    id: "notif-funds",
    label: "Funded transactions",
    description: "Push notification once a transaction has settled.",
    channel: "Webhook",
    enabled: true,
  },
  {
    id: "notif-receipt",
    label: "Receipt failures",
    description: "Alert when a submitted proof cannot be parsed.",
    channel: "SMS",
    enabled: false,
  },
];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(notificationDefaults);
  const [webhookUrl, setWebhookUrl] = useState(mockClientProfile.webhookUrl ?? "");
  const [theme, setTheme] = useState("dark");

  const groupedConfigs = useMemo(() => {
    const groups = new Map<string, (typeof mockAdminConfig)[number]>();
    mockAdminConfig.forEach((config) => {
      const group = config.group ?? "general";
      groups.set(group, [config, ...(groups.get(group) ?? [])]);
    });
    return Array.from(groups.entries());
  }, []);

  const totalStats = [
    {
      label: "Checkouts this month",
      value: mockClientProfile.stats.totalCheckoutsMonth,
      icon: <Activity className="h-4 w-4 text-slate-400" />,
    },
    {
      label: "Deposits this month",
      value: mockClientProfile.stats.totalDepositsMonth,
      icon: <FileText className="h-4 w-4 text-slate-400" />,
    },
    {
      label: "Funded this month",
      value: mockClientProfile.stats.totalFundedMonth,
      icon: <ShieldCheck className="h-4 w-4 text-slate-400" />,
    },
    {
      label: "Needs attention",
      value: mockClientProfile.stats.pendingAttention,
      icon: <Bell className="h-4 w-4 text-slate-400" />,
    },
  ];

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
  };

  return (
    <section className="space-y-6 pb-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-slate-400">
          Manage webhooks, branding, notification rules, and admin configuration values that back the client dashboard.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {totalStats.map((stat) => (
          <Card key={stat.label} className="border-slate-800/60 bg-slate-900/40">
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-slate-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-white">{stat.value.toLocaleString("en-US")}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-900/60 bg-white/5">
          <CardHeader className="border-b border-white/10 bg-slate-950/40">
            <CardTitle className="flex items-center justify-between text-base text-white">
              Webhooks &amp; API endpoints
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs uppercase text-slate-500">Webhook URL</Label>
              <Input
                className="bg-white/5 text-sm"
                value={webhookUrl}
                onChange={(event) => setWebhookUrl(event.target.value)}
                placeholder="https://api.yourapp.com/webhook"
              />
              <p className="text-xs text-slate-500">
                Payloads will be delivered to this endpoint after a deposit transitions to verified or rejected states.
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase text-slate-500">Webhook health</Label>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">200 OK</Badge>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Save webhook settings
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-900/60 bg-white/5">
          <CardHeader className="border-b border-white/10 bg-slate-950/40">
            <CardTitle className="flex items-center justify-between text-base text-white">
              Branding &amp; portal identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-slate-800">
                <img src={mockClientProfile.logoUrl ?? ""} alt={mockClientProfile.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm text-slate-200">{mockClientProfile.name}</p>
                <p className="text-xs text-slate-400">Slug: {mockClientProfile.slug}</p>
              </div>
            </div>
            <div>
              <Label className="text-xs uppercase text-slate-500">Dashboard theme</Label>
              <div className="mt-2 flex items-center gap-3">
                {(["light", "dark"] as const).map((candidate) => (
                  <Button
                    key={candidate}
                    variant={theme === candidate ? "solid" : "ghost"}
                    className="text-xs font-medium text-slate-100"
                    onClick={() => setTheme(candidate)}
                  >
                    {candidate}
                  </Button>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Your theme choice controls the navigation contrast for payer admins. The backend persists the value under <span className="font-mono">branding.theme</span>.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-900/60 bg-white/5">
        <CardHeader className="border-b border-white/10 bg-slate-950/40">
          <CardTitle className="flex items-center justify-between text-base text-white">
            Notification routing
            <Badge className="text-xs bg-slate-700 text-slate-100 border-white/10">Managed</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex flex-col gap-2 rounded-xl border border-slate-800/60 bg-slate-900/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{notification.label}</p>
                  <p className="text-xs text-slate-400">Channel: {notification.channel}</p>
                </div>
                <Switch
                  checked={notification.enabled}
                  onChange={() => toggleNotification(notification.id)}
                />
              </div>
              <p className="text-xs text-slate-400">{notification.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-slate-900/60 bg-white/5">
        <CardHeader className="border-b border-white/10 bg-slate-950/40">
          <CardTitle className="text-base text-white">Admin config overrides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {groupedConfigs.map(([group, configs]) => (
              <div key={group}>
                <p className="text-xs uppercase text-slate-400">{group}</p>
                <div className="mt-1 space-y-1 rounded-xl border border-slate-800/60 bg-slate-950/40 p-3">
                  {configs.map((config) => (
                    <div key={config.id} className="flex items-center justify-between gap-3 text-sm text-slate-200">
                      <div>
                        <p className="font-medium text-slate-100">{config.label ?? config.key}</p>
                        <p className="text-xs text-slate-400">{config.key}</p>
                      </div>
                      <Badge className="bg-white/10 text-xs text-emerald-200 border-emerald-400/30">{config.value}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
