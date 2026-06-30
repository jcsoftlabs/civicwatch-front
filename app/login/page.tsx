"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      router.replace(searchParams.get("next") ?? "/dashboard");
    }
  }, [router, searchParams, token]);

  async function submitLogin() {
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.replace(searchParams.get("next") ?? "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitLogin();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-hero-grid px-4 py-10">
      <Card className="w-full max-w-md border-white/20 bg-white p-6">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
            CivicWatch
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Connexion</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Connectez-vous a votre espace client pour suivre les mentions, les alertes et la veille de crise.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Mot de passe</label>
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
            />
          </div>
          {error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
