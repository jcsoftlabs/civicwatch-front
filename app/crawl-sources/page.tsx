"use client";

import { useCallback, useEffect, useState } from "react";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  civicWatchApi,
  type ApiCrawlSource
} from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface CrawlSummary {
  sourceId: string;
  checkedAt: string;
  pagesVisited: number;
  pagesSkipped: number;
  pagesUpdated: number;
  mentionsCreated: number;
  alertsCreated: number;
  errors: string[];
}

const initialForm = {
  name: "",
  baseUrl: "",
  startUrls: "",
  allowedDomains: "",
  checkIntervalMinutes: "60",
  maxPagesPerRun: "20"
};

export default function CrawlSourcesPage() {
  const { token, selectedOrganizationId } = useAuth();
  const [sources, setSources] = useState<ApiCrawlSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [checkResults, setCheckResults] = useState<Record<string, CrawlSummary>>({});

  const loadSources = useCallback(() => {
    if (!token || !selectedOrganizationId) return;

    setLoading(true);
    setError(null);
    civicWatchApi
      .crawlSources(token, selectedOrganizationId)
      .then((data) => setSources(data))
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Impossible de charger les sources de crawl."
        )
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
      await civicWatchApi.createCrawlSource(token, selectedOrganizationId, {
        name: form.name,
        baseUrl: form.baseUrl,
        startUrls: form.startUrls.split(",").map((item) => item.trim()).filter(Boolean),
        allowedDomains: form.allowedDomains.split(",").map((item) => item.trim()).filter(Boolean),
        active: false,
        respectRobotsTxt: true,
        checkIntervalMinutes: Number(form.checkIntervalMinutes),
        maxPagesPerRun: Number(form.maxPagesPerRun)
      });
      setForm(initialForm);
      setSuccess("Source de crawl ajoutée. Elle reste inactive tant que vous ne l’activez pas côté backend.");
      loadSources();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible d'ajouter la source de crawl."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const checkNow = async (sourceId: string) => {
    if (!token || !selectedOrganizationId) return;

    setCheckingId(sourceId);
    setError(null);

    try {
      const result = await civicWatchApi.checkCrawlSourceNow(
        token,
        selectedOrganizationId,
        sourceId
      );
      setCheckResults((current) => ({ ...current, [sourceId]: result }));
      loadSources();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible de lancer le crawl manuel."
      );
    } finally {
      setCheckingId(null);
    }
  };

  return (
    <ProtectedPage>
      <AppShell
        title="Crawling autorisé"
        subtitle="Surveillez uniquement les sites publics explicitement autorisés, avec respect de robots.txt et limites strictes."
      >
        <div className="space-y-6">
          <Card>
            <div className="grid gap-4 xl:grid-cols-[220px_1fr_1fr_160px_160px_auto]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Nom</label>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Ex. Médias locaux"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Base URL</label>
                <Input
                  value={form.baseUrl}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, baseUrl: event.target.value }))
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Start URLs
                </label>
                <Input
                  value={form.startUrls}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, startUrls: event.target.value }))
                  }
                  placeholder="https://example.com, https://example.com/news"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Intervalle
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
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Pages max
                </label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={form.maxPagesPerRun}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      maxPagesPerRun: event.target.value
                    }))
                  }
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={submit}
                  disabled={submitting || !form.name || !form.baseUrl || !form.startUrls}
                >
                  {submitting ? "Ajout..." : "Ajouter"}
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Domaines autorisés
              </label>
              <Input
                value={form.allowedDomains}
                onChange={(event) =>
                  setForm((current) => ({ ...current, allowedDomains: event.target.value }))
                }
                placeholder="lenouvelliste.com, satellite509.com"
              />
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Le backend respecte `robots.txt`, limite les volumes, n’essaie pas de contourner les protections
              et ne crawl que les domaines explicitement autorisés.
            </p>
          </Card>

          {success ? (
            <Card className="border-emerald-200 bg-emerald-50 text-emerald-900">{success}</Card>
          ) : null}

          {loading ? <LoadingState label="Chargement des sources de crawl..." /> : null}
          {error ? <ErrorState message={error} onRetry={loadSources} /> : null}

          {!loading && !error ? (
            <Card>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Sources autorisées</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Liste des sites publics configurés par organisation.
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
                      <th className="pb-3 font-medium">Robots</th>
                      <th className="pb-3 font-medium">Cadence</th>
                      <th className="pb-3 font-medium">Dernier crawl</th>
                      <th className="pb-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sources.map((source) => {
                      const lastRun = checkResults[source.id];

                      return (
                        <tr key={source.id} className="align-top">
                          <td className="py-4 pr-4">
                            <div className="font-semibold text-slate-900">{source.name}</div>
                            <div className="mt-1 text-xs text-slate-500">{source.baseUrl}</div>
                            <div className="mt-2 text-xs text-slate-500">
                              {source.allowedDomains.join(", ")}
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <Badge tone={source.active ? "positive" : "neutral"}>
                              {source.active ? "Actif" : "Inactif"}
                            </Badge>
                          </td>
                          <td className="py-4 pr-4">
                            <Badge tone={source.respectRobotsTxt ? "positive" : "critical"}>
                              {source.respectRobotsTxt ? "Respecté" : "Override"}
                            </Badge>
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            {source.checkIntervalMinutes} min / {source.maxPagesPerRun} pages
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            {source.lastCrawledAt
                              ? new Intl.DateTimeFormat("fr-FR", {
                                  dateStyle: "short",
                                  timeStyle: "short"
                                }).format(new Date(source.lastCrawledAt))
                              : "Jamais"}
                            {lastRun ? (
                              <div className="mt-2 text-xs text-slate-500">
                                {lastRun.pagesVisited} page(s), {lastRun.mentionsCreated} mention(s),{" "}
                                {lastRun.alertsCreated} alerte(s)
                              </div>
                            ) : null}
                            {lastRun?.errors.length ? (
                              <div className="mt-1 text-xs text-red-600">{lastRun.errors.join(" ")}</div>
                            ) : null}
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
