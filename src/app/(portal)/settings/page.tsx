"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowUpRight,
  Loader2,
  Lock,
  Mail,
  Settings2,
  User as UserIcon,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/authProvider";
import { PageHeader } from "@/components/shared/PageHeader";
import type { BetterAuthUser } from "@/lib/better-auth/types";

function profileDisplayName(u: BetterAuthUser) {
  if (typeof u.name === "string" && u.name.trim()) return u.name;
  return u.email?.split("@")[0] ?? "";
}

function SettingsForm({ user }: { user: BetterAuthUser }) {
  const [name, setName] = useState(() => profileDisplayName(user));
  const email = user.email ?? "";
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handlePasswordUpdate = async () => {
    setChangingPassword(true);
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setChangingPassword(false);
      return;
    }

    try {
      toast.error(
        "Password updates aren’t wired to Better Auth yet. Add a backend endpoint and we’ll hook it up here.",
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "An error occurred while updating password",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Account Settings"
        description="Manage your profile, password, and developer tools."
      />

      <Card className="border-border/70 shadow-sm">
        <CardHeader className="border-b border-border/70 bg-muted/30 pb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-background shadow-md">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs">
                <Mail className="h-3 w-3" />
                {email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
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

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-muted/50 text-primary">
                <Lock className="h-4 w-4" />
              </span>
              <div className="space-y-1">
                <CardTitle>Password & Authentication</CardTitle>
                <CardDescription>
                  Update your login credentials below.
                </CardDescription>
              </div>
            </div>
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
            <div className="grid gap-4 sm:grid-cols-2">
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
                onClick={handlePasswordUpdate}
                disabled={!newPassword || changingPassword}
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

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-muted/50 text-primary">
                <Zap className="h-4 w-4" />
              </span>
              <div className="space-y-1">
                <CardTitle>Integration Guide</CardTitle>
                <CardDescription>
                  Keep setup help and operational docs on a dedicated page.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="text-sm font-medium">What moved</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                Integration setup, configuration notes, code examples,
                troubleshooting, and FAQ content now live outside Settings for
                cleaner separation of concerns.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-background p-4">
                <Settings2 className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Settings stay focused</p>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    Profile and security controls remain here without mixing in
                    long-form product documentation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-background p-4">
                <UserIcon className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Docs scale better</p>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    The new page can hold provider guides, endpoint notes, and
                    more help content without making this screen crowded.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/integration"
              className={buttonVariants({ className: "w-full sm:w-auto" })}
            >
              Open integration page
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return user ? <SettingsForm key={user.id} user={user} /> : null;
}
