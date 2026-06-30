"use client";

import { useCallback, useEffect, useState } from "react";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { AppShell } from "@/components/layout/AppShell";
import { KeywordTable } from "@/components/keywords/KeywordTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { civicWatchApi, normalizeKeyword } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Keyword } from "@/lib/mock-data";

export default function KeywordsPage() {
  const { token, selectedOrganizationId } = useAuth();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadKeywords = useCallback(() => {
    if (!token || !selectedOrganizationId) return;

    setLoading(true);
    setError(null);
    civicWatchApi
      .keywords(token, selectedOrganizationId)
      .then((data) => setKeywords(data.map(normalizeKeyword)))
      .catch((err) => setError(err instanceof Error ? err.message : "Impossible de charger les mots-clés."))
      .finally(() => setLoading(false));
  }, [selectedOrganizationId, token]);

  useEffect(() => {
    loadKeywords();
  }, [loadKeywords]);

  return (
    <ProtectedPage>
      <AppShell
        title="Gestion des mots-clés"
        subtitle="Configurez les termes, alias et sujets sensibles à surveiller"
      >
        <div className="space-y-6">
        <Card>
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px_auto]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Ajouter un mot-clé
              </label>
              <Input placeholder="Ex. Jean Exemple, corruption, #JeanExemple" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Type</label>
              <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10">
                <option>Nom</option>
                <option>Entreprise</option>
                <option>Hashtag</option>
                <option>Alias</option>
                <option>Sujet sensible</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Priorité
              </label>
              <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10">
                <option>Faible</option>
                <option>Moyenne</option>
                <option>Haute</option>
                <option>Critique</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button>Ajouter</Button>
            </div>
          </div>
        </Card>

        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={loadKeywords} /> : null}
        {!loading && !error ? <KeywordTable data={keywords} /> : null}
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
