"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, User as UserIcon, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/authProvider";
import { PageHeader } from "@/components/shared/PageHeader";

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

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    await new Promise((r) => setTimeout(r, 600));
    setSavingProfile(false);
    toast.success("Profile updated");
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setChangingPassword(true);
    await new Promise((r) => setTimeout(r, 800));

    setChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    toast.success("Password changed successfully");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-10 animate-in fade-in duration-300">
      <PageHeader
        title="Account settings"
        description="Profile details from your login and optional password change workflow. Connect Supabase or your IdP for production password policies."
      />

      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardHeader className="border-b border-border bg-muted/20 py-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border border-border">
              <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm">
                {name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-sm font-semibold text-foreground">
                {name || "—"}
              </p>
              <p className="text-xs text-muted-foreground">{email || "—"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="settings-name" className="text-xs font-medium">
              Full name
            </Label>
            <Input
              id="settings-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="settings-email" className="text-xs font-medium">
              Email
            </Label>
            <Input
              id="settings-email"
              value={email}
              disabled
              className="bg-muted/50 text-muted-foreground"
            />
          </div>

          <Button
            type="button"
            onClick={handleSaveProfile}
            disabled={savingProfile}
          >
            {savingProfile ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/80 shadow-sm">
        <CardHeader className="border-b border-border bg-muted/20 py-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Lock className="h-4 w-4 text-muted-foreground" />
            Security
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="current-pw" className="text-xs font-medium">
              Current password
            </Label>
            <Input
              id="current-pw"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-pw" className="text-xs font-medium">
              New password
            </Label>
            <Input
              id="new-pw"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-pw" className="text-xs font-medium">
              Confirm password
            </Label>
            <Input
              id="confirm-pw"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-background"
            />
          </div>

          <Button
            type="button"
            onClick={handleChangePassword}
            disabled={changingPassword}
          >
            {changingPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating…
              </>
            ) : (
              "Change password"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[240px] text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading profile…
      </div>
    );
  }

  if (!user) {
    return (
      <p className="text-sm text-muted-foreground">
        Sign in to manage your settings.
      </p>
    );
  }

  return <SettingsForm key={user.id} user={user} />;
}
