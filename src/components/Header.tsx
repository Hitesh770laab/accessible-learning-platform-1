"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAccessibility } from "./AccessibilityProvider";
import { Menu } from "lucide-react";
import React from "react";
import AccessibilityPanel from "./AccessibilityPanel";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { highContrast, setHighContrast } = useAccessibility();
  const [open, setOpen] = React.useState(false);
  const { data: session, isPending, refetch } = useSession();

  const handleSignOut = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : "";
    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b" role="banner">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-primary text-primary-foreground px-3 py-2 rounded">
        Skip to main content
      </a>
      <nav aria-label="Primary" className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring rounded">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold" aria-hidden>
              A
            </span>
            <span className="font-semibold">Accessible Learn</span>
          </Link>

          <div className="hidden md:flex items-center gap-6" role="menubar">
            <NavLink href="/" current={pathname === "/"}>Home</NavLink>
            <NavLink href="/captions" current={pathname.startsWith("/captions")}>Live Captions</NavLink>
            <NavLink href="/reader" current={pathname.startsWith("/reader")}>Reader & OCR</NavLink>
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm" htmlFor="contrast">
              <span>High contrast</span>
              <Switch id="contrast" checked={highContrast} onCheckedChange={setHighContrast} aria-label="Toggle high contrast theme" />
            </label>
            <AccessibilityPanel />
            {/* Auth actions (desktop) */}
            {!isPending && (
              session?.user ? (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm text-muted-foreground max-w-[12ch] truncate" title={session.user.email || session.user.name}>
                    {session.user.name || session.user.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>Sign out</Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )
            )}
            <Button variant="outline" className="md:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label="Open menu" onClick={() => setOpen((o) => !o)}>
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
        {open && (
          <div id="mobile-menu" className="md:hidden pb-3" role="menu">
            <div className="flex flex-col gap-2">
              <MobileLink href="/" onClick={() => setOpen(false)} current={pathname === "/"}>Home</MobileLink>
              <MobileLink href="/captions" onClick={() => setOpen(false)} current={pathname.startsWith("/captions")}>Live Captions</MobileLink>
              <MobileLink href="/reader" onClick={() => setOpen(false)} current={pathname.startsWith("/reader")}>Reader & OCR</MobileLink>
              {/* Auth actions (mobile) */}
              {!isPending && (
                session?.user ? (
                  <button
                    onClick={() => { setOpen(false); handleSignOut(); }}
                    className="text-left px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent"
                  >
                    Sign out
                  </button>
                ) : (
                  <>
                    <MobileLink href="/login" onClick={() => setOpen(false)}>Login</MobileLink>
                    <MobileLink href="/register" onClick={() => setOpen(false)}>Register</MobileLink>
                  </>
                )
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({ href, current, children }: { href: string; current?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      aria-current={current ? "page" : undefined}
      className={`px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring ${current ? "bg-secondary" : "hover:bg-accent"}`}
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, current, onClick, children }: { href: string; current?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      aria-current={current ? "page" : undefined}
      onClick={onClick}
      className={`px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring ${current ? "bg-secondary" : "hover:bg-accent"}`}
    >
      {children}
    </Link>
  );
}