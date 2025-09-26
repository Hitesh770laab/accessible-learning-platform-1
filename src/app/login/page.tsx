import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main id="main" className="min-h-[calc(100vh-56px)]">
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign in</CardTitle>
            </CardHeader>
            <CardContent>
              <LoginForm />
              <p className="mt-4 text-sm text-muted-foreground">
                Dont have an account?{" "}
                <Link href="/register" className="underline underline-offset-4">Create one</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}