"use client";

import { useCallback, useEffect, useState } from "react";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { civicWatchApi, type ApiRssSource } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface CheckSummary {
  checkedAt: string;
  createdMentions: number;
  createdAlerts: number;
  skippedDuplicates: number;
  matchedItems: number;
  errors: string[];
}

const initialForm = {
  name: "",
  feedUrl: "",
  websiteUrl: "",
  checkIntervalMinutes: "15"
};

export default function RssPage() {
  const { token, selectedOrganizationId } = useAuth();
  const [sources, setSources] = useState<ApiRssSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [checkResults, setCheckResults] = useState<Record<string, CheckSummary>>({});

  const loadSources = useCallback(() => {
    if (!token || !selectedOrganizationId) return;

    setLoading(true);
    setError(null);
    civicWatchApi
      .rssSources(token, selectedOrganizationId)
      .then((data) => setSources(data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Impossible de charger les flux RSS.")
      )
      .finally(() => setLoading(false));
  }, [selectedOrganizationId, token]);

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  const submit = async () => {
    if (!token || !selectedOrganizationId) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await civicWatchApi.createRssSource(token, selectedOrganizationId, {
        name: form.name,
        feedUrl: form.feedUrl,
        websiteUrl: form.websiteUrl || undefined,
        active: true,
        checkIntervalMinutes: Number(form.checkIntervalMinutes)
      });
      setForm(initialForm);
      setSuccess("Source RSS ajoutée. Elle apparaîtra dans le prochain cycle de veille.");
      loadSources();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'ajouter la source RSS.");
    } finally {
      setSubmitting(false);
    }
  };

  const checkNow = async (sourceId: string) => {
    if (!token || !selectedOrganizationId) return;

    setCheckingId(sourceId);
    setError(null);
    try {
      const result = await civicWatchApi.checkRssSourceNow(token, selectedOrganizationId, sourceId);
      setCheckResults((current) => ({ ...current, [sourceId]: result }));
      loadSources();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de lancer la vérification RSS.");
    } finally {
      setCheckingId(null);
    }
  };

  return (
    <ProtectedPage>
      <AppShell
        title="Administration RSS"
        subtitle="Configurez les flux médias, déclenchez des vérifications et surveillez la fraîcheur des scans."
      >
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Nom du flux</label>
                  <Input
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Ex. Haiti Libre"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Feed URL</label>
                  <Input
                    value={form.feedUrl}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, feedUrl: event.target.value }))
                    }
                    placeholder="https://example.com/rss.xml"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Site web
                  </label>
                  <Input
                    value={form.websiteUrl}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, websiteUrl: event.target.value }))
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Fréquence (min)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={1440}
                    value={form.checkIntervalMinutes}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        checkIntervalMinutes: event.target.value
                      }))
                    }
                  />
                </div>
              </div>
              <Button onClick={submit} disabled={submitting || !form.name || !form.feedUrl}>
                {submitting ? "Ajout..." : "Ajouter la source"}
              </Button>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Les sources ajoutées seront vérifiées automatiquement côté backend, puis enrichiront les
              mentions et alertes dès qu’un mot-clé actif est détecté.
            </p>
          </Card>

          {success ? (
            <Card className="border-emerald-200 bg-emerald-50 text-emerald-900">{success}</Card>
          ) : null}

          {loading ? <LoadingState label="Chargement des flux RSS..." /> : null}
          {error ? <ErrorState message={error} onRetry={loadSources} /> : null}

          {!loading && !error ? (
            <Card>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Sources RSS surveillées</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Vue opérationnelle des flux branchés par organisation.
                  </p>
                </div>
                <Badge tone="medium">{sources.length} source(s)</Badge>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    <tr>
                      <th className="pb-3 font-medium">Source</th>
                      <th className="pb-3 font-medium">Statut</th>
                      <th className="pb-3 font-medium">Fréquence</th>
                      <th className="pb-3 font-medium">Dernier check</th>
                      <th className="pb-3 font-medium">URL</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sources.map((source) => {
                      const lastRun = checkResults[source.id];

                      return (
                        <tr key={source.id} className="align-top">
                          <td className="py-4 pr-4">
                            <div className="font-semibold text-slate-900">{source.name}</div>
                            {source.websiteUrl ? (
                              <a
                                href={source.websiteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-1 inline-block text-xs text-brand hover:underline"
                              >
                                Ouvrir le site
                              </a>
                            ) : null}
                          </td>
                          <td className="py-4 pr-4">
                            <Badge tone={source.active ? "positive" : "neutral"}>
                              {source.active ? "Actif" : "Désactivé"}
                            </Badge>
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            Toutes les {source.checkIntervalMinutes} min
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            {source.lastCheckedAt
                              ? new Intl.DateTimeFormat("fr-FR", {
                                  dateStyle: "short",
                                  timeStyle: "short"
                                }).format(new Date(source.lastCheckedAt))
                              : "Jamais"}
                            {lastRun ? (
                              <div className="mt-2 text-xs text-slate-500">
                                {lastRun.createdMentions} mention(s), {lastRun.createdAlerts} alerte(s),{" "}
                                {lastRun.skippedDuplicates} doublon(s)
                              </div>
                            ) : null}
                            {lastRun?.errors.length ? (
                              <div className="mt-1 text-xs text-red-600">{lastRun.errors.join(" ")}</div>
                            ) : null}
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            <div className="max-w-xs truncate">{source.feedUrl}</div>
                          </td>
                          <td className="py-4 text-right">
                            <Button
                              variant="secondary"
                              onClick={() => checkNow(source.id)}
                              disabled={checkingId === source.id}
                            >
                              {checkingId === source.id ? "Analyse..." : "Check now"}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : null}
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
