"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const search = useSearchParams();
  const { refetch } = useSession();
  const [loading, setLoading] = React.useState(false);

  const [form, setForm] = React.useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const registered = search?.get("registered");
  React.useEffect(() => {
    if (registered) {
      toast.success("Account created! Please log in.");
    }
  }, [registered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
        rememberMe: form.rememberMe,
        callbackURL: "/captions",
      });

      if (error?.code) {
        toast.error("Invalid email or password. Please try again.");
        return;
      }

      toast.success("Logged in successfully");
      await refetch();
      router.push("/captions");
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          autoComplete="off"
          placeholder="••••••••"
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={form.rememberMe}
          onCheckedChange={(v) => setForm((f) => ({ ...f, rememberMe: Boolean(v) }))}
        />
        <Label htmlFor="remember" className="text-sm text-muted-foreground">
          Remember me
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};

export default LoginForm;