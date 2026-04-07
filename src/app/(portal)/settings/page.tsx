"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  User as UserIcon,
  Lock,
  Mail,
  ShieldCheck,
  Settings2,
  CheckCircle2,
  Code2,
  Copy,
  Terminal,
  ExternalLink,
  Globe,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/authProvider";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

function profileDisplayName(u: User) {
  const meta = u.user_metadata as Record<string, unknown> | undefined;
  if (typeof meta?.full_name === "string") return meta.full_name;
  if (typeof meta?.name === "string") return meta.name;
  return u.email?.split("@")[0] ?? "";
}

function SettingsForm({ user }: { user: User }) {
  const [name, setName] = useState(() => profileDisplayName(user));
  const email = user.email ?? "";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  const handlePasswordUpdate = async () => {
    setChangingPassword(true);
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        toast.error(
          error.message || "Your are Not authenticated please re-loading",
        );
        return;
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while updating password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Account Settings"
        description="Manage your profile and developer configurations."
      />

      {/* 1. Profile Card (Always Visible) */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 pb-6 border-b">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-background shadow-md">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription className="text-xs flex items-center gap-1">
                <Mail className="h-3 w-3" /> {email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Display Name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Email
              </Label>
              <Input value={email} disabled className="bg-muted/30 italic" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              size="sm"
              onClick={() => setSavingProfile(true)}
              disabled={savingProfile}
            >
              {savingProfile ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Tabs for Security & Integration */}
      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 border">
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="integration" className="gap-2">
            <Zap className="h-4 w-4" /> Integration
          </TabsTrigger>
        </TabsList>

        {/* SECURITY TAB */}
        <TabsContent value="security">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-md">
                Password & Authentication
              </CardTitle>
              <CardDescription>
                Update your login credentials below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Confirm New</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  variant="secondary"
                  onClick={() => handlePasswordUpdate()}
                  disabled={!newPassword}
                >
                  {changingPassword ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* INTEGRATION TAB */}
        {/* INTEGRATION TAB */}
        <TabsContent value="integration" className="space-y-6">
          <Card className="border-slate-800 bg-slate-950 text-slate-200 overflow-hidden">
            <CardHeader className="border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-emerald-500" />
                    API Gateway Config
                  </CardTitle>
                  <CardDescription className="text-slate-500 text-xs font-mono">
                    Endpoint: https://api.yourdomain.com/gateway/checkout
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Dynamic Key Management Shortcut */}
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-emerald-500/10 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="text-sm font-bold text-white">
                    Manage Your API Credentials
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    For security, your <b>API Key</b> and <b>Secret Key</b> are
                    managed on a separate page. Generate new keys or rotate
                    existing ones to keep your integration secure.
                  </p>
                </div>
                <Link href="/api-keys">
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                  >
                    Go to API Keys Page <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>

              {/* Integration Guide Section */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]"
                  >
                    POST
                  </Badge>
                  <span className="text-xs font-bold text-slate-300">
                    Implementation Example
                  </span>
                </div>

                <div className="rounded-md bg-black p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Request Body
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px] text-slate-400 hover:text-white"
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify("requestExample", null, 2),
                        )
                      }
                    >
                      <Copy className="h-3 w-3 mr-1" /> Copy JSON
                    </Button>
                  </div>
                  <pre className="text-[11px] font-mono leading-relaxed text-blue-300 overflow-x-auto">
                    {`{
  "api_key": "YOUR_API_KEY",
  "api_secret": "YOUR_API_SECRET",
  "amount": 1,
  "product_name": "iTunes Gift Card",
  "customer_name": "John Doe",
  "customer_email": "john.doe@example.com",
  "webhook_url": "https://yoursite.com/api/webhook",
  "success_url": "https://yoursite.com/success",
  "cancel_url": "https://yoursite.com/cancel",
  "failed_url": "https://yoursite.com/failed",
  "invoice_id": "inv_123456789",
  "userId": "abebe"
}`}
                  </pre>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]"
                    >
                      RESPONSE
                    </Badge>
                    <span className="text-xs font-bold text-slate-300">
                      Success Payload
                    </span>
                  </div>
                  <div className="rounded-md bg-black p-4 border border-slate-800">
                    <pre className="text-[11px] font-mono leading-relaxed text-emerald-400">
                      {`{
  "status": "success",
  "checkoutID": "ea10a56c-fe4f-460c-a854-9e1a3221b120",
  "checkoutUrl": "https://gateway.com/deposit/eyJhbGci..."
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Small Badge helper since it's used in the template
const Badge = ({ children, className, variant }: any) => (
  <span
    className={cn(
      "px-1.5 py-0.5 rounded text-[10px] font-bold border",
      className,
    )}
  >
    {children}
  </span>
);

export default function SettingsPage() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );

  return user ? <SettingsForm key={user.id} user={user} /> : null;
}
