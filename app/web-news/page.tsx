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
  type ApiWebNewsProvider,
  type ApiWebNewsQuery
} from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface CheckSummary {
  organizationId: string;
  checkedAt: string;
  queriesProcessed: number;
  providerCalls: number;
  createdMentions: number;
  createdAlerts: number;
  skippedDuplicates: number;
  matchedResults: number;
  errors: string[];
}

const initialProviderForm = {
  provider: "GDELT" as const,
  label: "GDELT Gratuit",
  baseUrl: "https://api.gdeltproject.org/api/v2/doc/doc"
};

const initialQueryForm = {
  name: "",
  query: "",
  language: "fr",
  country: "HA",
  checkIntervalMinutes: "30"
};

export default function WebNewsPage() {
  const { token, selectedOrganizationId } = useAuth();
  const [providers, setProviders] = useState<ApiWebNewsProvider[]>([]);
  const [queries, setQueries] = useState<ApiWebNewsQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [providerForm, setProviderForm] = useState(initialProviderForm);
  const [queryForm, setQueryForm] = useState(initialQueryForm);
  const [submittingProvider, setSubmittingProvider] = useState(false);
  const [submittingQuery, setSubmittingQuery] = useState(false);
  const [runningCheck, setRunningCheck] = useState(false);
  const [runningQueryId, setRunningQueryId] = useState<string | null>(null);
  const [lastCheckSummary, setLastCheckSummary] = useState<CheckSummary | null>(null);

  const loadData = useCallback(() => {
    if (!token || !selectedOrganizationId) return;

    setLoading(true);
    setError(null);

    Promise.all([
      civicWatchApi.webNewsProviders(token, selectedOrganizationId),
      civicWatchApi.webNewsQueries(token, selectedOrganizationId)
    ])
      .then(([providerData, queryData]) => {
        setProviders(providerData);
        setQueries(queryData);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Impossible de charger la veille Web/News.")
      )
      .finally(() => setLoading(false));
  }, [selectedOrganizationId, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createProvider = async () => {
    if (!token || !selectedOrganizationId) return;

    setSubmittingProvider(true);
    setError(null);
    setSuccess(null);

    try {
      await civicWatchApi.createWebNewsProvider(token, selectedOrganizationId, {
        provider: providerForm.provider,
        label: providerForm.label,
        baseUrl: providerForm.baseUrl,
        active: true
      });
      setSuccess("Provider Web/News ajouté.");
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'ajouter le provider.");
    } finally {
      setSubmittingProvider(false);
    }
  };

  const createQuery = async () => {
    if (!token || !selectedOrganizationId) return;

    setSubmittingQuery(true);
    setError(null);
    setSuccess(null);

    try {
      await civicWatchApi.createWebNewsQuery(token, selectedOrganizationId, {
        name: queryForm.name,
        query: queryForm.query,
        language: queryForm.language || undefined,
        country: queryForm.country || undefined,
        active: true,
        checkIntervalMinutes: Number(queryForm.checkIntervalMinutes)
      });
      setQueryForm(initialQueryForm);
      setSuccess("Requête Web/News ajoutée.");
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'ajouter la requête.");
    } finally {
      setSubmittingQuery(false);
    }
  };

  const checkNow = async () => {
    if (!token || !selectedOrganizationId) return;

    setRunningCheck(true);
    setError(null);
    try {
      const summary = await civicWatchApi.checkWebNewsNow(token, selectedOrganizationId);
      setLastCheckSummary(summary);
      setSuccess("Vérification Web/News terminée.");
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de lancer la vérification.");
    } finally {
      setRunningCheck(false);
    }
  };

  const checkQueryNow = async (queryId: string) => {
    if (!token || !selectedOrganizationId) return;

    setRunningQueryId(queryId);
    setError(null);
    try {
      const summary = await civicWatchApi.checkWebNewsQueryNow(token, selectedOrganizationId, queryId);
      setLastCheckSummary(summary);
      setSuccess("Vérification ciblée terminée.");
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de lancer la vérification ciblée.");
    } finally {
      setRunningQueryId(null);
    }
  };

  return (
    <ProtectedPage>
      <AppShell
        title="Administration Web & News"
        subtitle="Pilotez une veille presse gratuite avec GDELT, et préparez des connecteurs premium plus tard."
      >
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Mode gratuit activable</h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-500">
                  La configuration la plus économique repose sur GDELT, sans clé API. Les providers
                  payants restent disponibles comme structure d’évolution sans être nécessaires pour
                  démarrer.
                </p>
              </div>
              <Button onClick={checkNow} disabled={runningCheck}>
                {runningCheck ? "Analyse globale..." : "Lancer une vérification"}
              </Button>
            </div>
          </Card>

          {success ? (
            <Card className="border-emerald-200 bg-emerald-50 text-emerald-900">{success}</Card>
          ) : null}

          {lastCheckSummary ? (
            <Card>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Requêtes</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-950">
                    {lastCheckSummary.queriesProcessed}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Mentions</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-950">
                    {lastCheckSummary.createdMentions}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Alertes</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-950">
                    {lastCheckSummary.createdAlerts}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Doublons</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-950">
                    {lastCheckSummary.skippedDuplicates}
                  </div>
                </div>
              </div>
              {lastCheckSummary.errors.length ? (
                <p className="mt-4 text-sm text-red-700">{lastCheckSummary.errors.join(" ")}</p>
              ) : null}
            </Card>
          ) : null}

          {loading ? <LoadingState label="Chargement des providers et requêtes Web/News..." /> : null}
          {error ? <ErrorState message={error} onRetry={loadData} /> : null}

          {!loading && !error ? (
            <>
              <Card>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">Providers de recherche</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      GDELT suffit pour une première veille gratuite et structurée.
                    </p>
                  </div>
                  <Badge tone="medium">{providers.length} provider(s)</Badge>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[180px_1fr_1fr_auto]">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Provider</label>
                    <select
                      value={providerForm.provider}
                      onChange={(event) =>
                        setProviderForm((current) => ({
                          ...current,
                          provider: event.target.value as typeof current.provider
                        }))
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                    >
                      <option value="GDELT">GDELT</option>
                      <option value="NEWS_API">NewsAPI</option>
                      <option value="BRAVE_SEARCH">Brave Search</option>
                      <option value="SERP_API">SerpAPI</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Libellé</label>
                    <Input
                      value={providerForm.label}
                      onChange={(event) =>
                        setProviderForm((current) => ({ ...current, label: event.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Base URL</label>
                    <Input
                      value={providerForm.baseUrl}
                      onChange={(event) =>
                        setProviderForm((current) => ({ ...current, baseUrl: event.target.value }))
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={createProvider}
                      disabled={submittingProvider || !providerForm.label}
                    >
                      {submittingProvider ? "Ajout..." : "Ajouter"}
                    </Button>
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      <tr>
                        <th className="pb-3 font-medium">Provider</th>
                        <th className="pb-3 font-medium">Statut</th>
                        <th className="pb-3 font-medium">Clé API</th>
                        <th className="pb-3 font-medium">Dernier check</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {providers.map((provider) => (
                        <tr key={provider.id}>
                          <td className="py-4 pr-4">
                            <div className="font-semibold text-slate-900">{provider.label}</div>
                            <div className="mt-1 text-xs text-slate-500">{provider.provider}</div>
                          </td>
                          <td className="py-4 pr-4">
                            <Badge tone={provider.active ? "positive" : "neutral"}>
                              {provider.active ? "Actif" : "Désactivé"}
                            </Badge>
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            {provider.hasApiKey ? "Présente" : "Aucune"}
                          </td>
                          <td className="py-4 text-slate-600">
                            {provider.lastCheckedAt
                              ? new Intl.DateTimeFormat("fr-FR", {
                                  dateStyle: "short",
                                  timeStyle: "short"
                                }).format(new Date(provider.lastCheckedAt))
                              : "Jamais"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">Requêtes surveillées</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Chaque requête peut être relancée à la demande, même avec un setup gratuit.
                    </p>
                  </div>
                  <Badge tone="medium">{queries.length} requête(s)</Badge>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-[220px_1fr_120px_120px_160px_auto]">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Nom</label>
                    <Input
                      value={queryForm.name}
                      onChange={(event) =>
                        setQueryForm((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="Ex. Fritz Michel"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Query</label>
                    <Input
                      value={queryForm.query}
                      onChange={(event) =>
                        setQueryForm((current) => ({ ...current, query: event.target.value }))
                      }
                      placeholder='"Fritz William Michel" corruption scandale gouvernance'
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Langue</label>
                    <Input
                      value={queryForm.language}
                      onChange={(event) =>
                        setQueryForm((current) => ({ ...current, language: event.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Pays</label>
                    <Input
                      value={queryForm.country}
                      onChange={(event) =>
                        setQueryForm((current) => ({ ...current, country: event.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Fréquence
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={1440}
                      value={queryForm.checkIntervalMinutes}
                      onChange={(event) =>
                        setQueryForm((current) => ({
                          ...current,
                          checkIntervalMinutes: event.target.value
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={createQuery}
                      disabled={submittingQuery || !queryForm.name || !queryForm.query}
                    >
                      {submittingQuery ? "Ajout..." : "Ajouter"}
                    </Button>
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      <tr>
                        <th className="pb-3 font-medium">Nom</th>
                        <th className="pb-3 font-medium">Query</th>
                        <th className="pb-3 font-medium">Fréquence</th>
                        <th className="pb-3 font-medium">Dernier check</th>
                        <th className="pb-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {queries.map((query) => (
                        <tr key={query.id} className="align-top">
                          <td className="py-4 pr-4">
                            <div className="font-semibold text-slate-900">{query.name}</div>
                            <div className="mt-1 text-xs text-slate-500">
                              {query.language || "N/A"} / {query.country || "N/A"}
                            </div>
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            <div className="max-w-xl">{query.query}</div>
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            Toutes les {query.checkIntervalMinutes} min
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            {query.lastCheckedAt
                              ? new Intl.DateTimeFormat("fr-FR", {
                                  dateStyle: "short",
                                  timeStyle: "short"
                                }).format(new Date(query.lastCheckedAt))
                              : "Jamais"}
                          </td>
                          <td className="py-4 text-right">
                            <Button
                              variant="secondary"
                              onClick={() => checkQueryNow(query.id)}
                              disabled={runningQueryId === query.id}
                            >
                              {runningQueryId === query.id ? "Analyse..." : "Check now"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          ) : null}
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
