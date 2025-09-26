import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main id="main" className="min-h-[calc(100vh-56px)]">
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create account</CardTitle>
            </CardHeader>
            <CardContent>
              <RegisterForm />
              <p className="mt-4 text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">Sign in</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}