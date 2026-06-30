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
  type ApiXConnection,
  type ApiXRule,
  type XCheckSummary
} from "@/lib/api";
import { useAuth } from "@/lib/auth";

const initialConnectionForm = {
  label: "Connexion X officielle",
  bearerToken: "",
  useEnvBearerToken: true
};

const initialRuleForm = {
  name: "Fritz William Michel mentions",
  query: '"Fritz William Michel" OR "Fritz Michel" OR "FWM" -is:retweet',
  checkIntervalMinutes: "5"
};

export default function XMonitoringPage() {
  const { token, selectedOrganizationId } = useAuth();
  const [connections, setConnections] = useState<ApiXConnection[]>([]);
  const [rules, setRules] = useState<ApiXRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [connectionForm, setConnectionForm] = useState(initialConnectionForm);
  const [ruleForm, setRuleForm] = useState(initialRuleForm);
  const [submittingConnection, setSubmittingConnection] = useState(false);
  const [submittingRule, setSubmittingRule] = useState(false);
  const [runningCheck, setRunningCheck] = useState(false);
  const [runningRuleId, setRunningRuleId] = useState<string | null>(null);
  const [lastCheckSummary, setLastCheckSummary] = useState<XCheckSummary | null>(null);

  const loadData = useCallback(() => {
    if (!token || !selectedOrganizationId) return;

    setLoading(true);
    setError(null);

    Promise.all([
      civicWatchApi.xConnections(token, selectedOrganizationId),
      civicWatchApi.xRules(token, selectedOrganizationId)
    ])
      .then(([connectionData, ruleData]) => {
        setConnections(connectionData);
        setRules(ruleData);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Impossible de charger le module X.")
      )
      .finally(() => setLoading(false));
  }, [selectedOrganizationId, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createConnection = async () => {
    if (!token || !selectedOrganizationId) return;

    setSubmittingConnection(true);
    setError(null);
    setSuccess(null);

    try {
      await civicWatchApi.createXConnection(token, selectedOrganizationId, {
        label: connectionForm.label,
        bearerToken: connectionForm.useEnvBearerToken
          ? undefined
          : connectionForm.bearerToken || undefined,
        status: "ACTIVE",
        useEnvBearerToken: connectionForm.useEnvBearerToken,
        config: {
          recentSearchBaseUrl: "https://api.x.com/2"
        }
      });
      setSuccess("Connexion X enregistrée.");
      setConnectionForm(initialConnectionForm);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'ajouter la connexion X.");
    } finally {
      setSubmittingConnection(false);
    }
  };

  const createRule = async () => {
    if (!token || !selectedOrganizationId) return;

    setSubmittingRule(true);
    setError(null);
    setSuccess(null);

    try {
      await civicWatchApi.createXRule(token, selectedOrganizationId, {
        name: ruleForm.name,
        query: ruleForm.query,
        active: true,
        checkIntervalMinutes: Number(ruleForm.checkIntervalMinutes)
      });
      setSuccess("Règle X ajoutée.");
      setRuleForm(initialRuleForm);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'ajouter la règle X.");
    } finally {
      setSubmittingRule(false);
    }
  };

  const checkNow = async () => {
    if (!token || !selectedOrganizationId) return;

    setRunningCheck(true);
    setError(null);

    try {
      const summary = await civicWatchApi.checkXNow(token, selectedOrganizationId, 25);
      setLastCheckSummary(summary);
      setSuccess("Vérification X terminée.");
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de lancer la vérification X.");
    } finally {
      setRunningCheck(false);
    }
  };

  const checkRuleNow = async (ruleId: string) => {
    if (!token || !selectedOrganizationId) return;

    setRunningRuleId(ruleId);
    setError(null);

    try {
      const summary = await civicWatchApi.checkXRuleNow(token, selectedOrganizationId, ruleId, 25);
      setLastCheckSummary(summary);
      setSuccess("Vérification ciblée X terminée.");
      loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible de lancer la vérification ciblée X."
      );
    } finally {
      setRunningRuleId(null);
    }
  };

  return (
    <ProtectedPage>
      <AppShell
        title="Administration X Monitoring"
        subtitle="Connectez l’API officielle X, gérez les requêtes Recent Search et déclenchez des checks à la demande."
      >
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">API officielle uniquement</h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-500">
                  Aucun scraping. Les tokens restent côté backend, chiffrés, et la première phase
                  utilise Recent Search avant une future évolution vers Filtered Stream.
                </p>
              </div>
              <Button onClick={checkNow} disabled={runningCheck}>
                {runningCheck ? "Analyse X..." : "Lancer une vérification X"}
              </Button>
            </div>
          </Card>

          {success ? (
            <Card className="border-emerald-200 bg-emerald-50 text-emerald-900">{success}</Card>
          ) : null}

          {lastCheckSummary ? (
            <Card>
              <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-5">
                <Metric label="Règles" value={lastCheckSummary.rulesProcessed} />
                <Metric label="Mentions" value={lastCheckSummary.createdMentions} />
                <Metric label="Alertes" value={lastCheckSummary.createdAlerts} />
                <Metric label="Doublons" value={lastCheckSummary.skippedDuplicates} />
                <Metric label="Posts matchés" value={lastCheckSummary.matchedPosts} />
              </div>
              {lastCheckSummary.status === "quota_exceeded" ? (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  L’API X a bien été contactée, mais le compte développeur n’a plus de crédits
                  disponibles pour `Recent Search`.
                </div>
              ) : null}
              {lastCheckSummary.status === "auth_error" ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                  L’API X a refusé l’authentification. Vérifiez le bearer token configuré sur
                  Railway.
                </div>
              ) : null}
              {lastCheckSummary.errors.length ? (
                <p className="mt-4 text-sm text-red-700">{lastCheckSummary.errors.join(" ")}</p>
              ) : null}
            </Card>
          ) : null}

          {loading ? <LoadingState label="Chargement de la configuration X..." /> : null}
          {error ? <ErrorState message={error} onRetry={loadData} /> : null}

          {!loading && !error ? (
            <>
              <Card>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">Connexions X</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Le bearer token reste en backend. Vous pouvez soit le stocker chiffré, soit
                      faire reposer la connexion sur la variable serveur `X_BEARER_TOKEN`.
                    </p>
                  </div>
                  <Badge tone="x">{connections.length} connexion(s)</Badge>
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_1fr_auto]">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Libellé</label>
                    <Input
                      value={connectionForm.label}
                      onChange={(event) =>
                        setConnectionForm((current) => ({
                          ...current,
                          label: event.target.value
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Bearer token
                    </label>
                    <Input
                      value={connectionForm.bearerToken}
                      onChange={(event) =>
                        setConnectionForm((current) => ({
                          ...current,
                          bearerToken: event.target.value
                        }))
                      }
                      placeholder="Laisser vide si vous utilisez X_BEARER_TOKEN côté Railway"
                      disabled={connectionForm.useEnvBearerToken}
                    />
                    <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={connectionForm.useEnvBearerToken}
                        onChange={(event) =>
                          setConnectionForm((current) => ({
                            ...current,
                            useEnvBearerToken: event.target.checked
                          }))
                        }
                      />
                      Utiliser `X_BEARER_TOKEN` depuis l’environnement serveur
                    </label>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={createConnection}
                      disabled={
                        submittingConnection ||
                        !connectionForm.label ||
                        (!connectionForm.useEnvBearerToken && !connectionForm.bearerToken)
                      }
                    >
                      {submittingConnection ? "Ajout..." : "Ajouter"}
                    </Button>
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      <tr>
                        <th className="pb-3 font-medium">Connexion</th>
                        <th className="pb-3 font-medium">Statut</th>
                        <th className="pb-3 font-medium">Token</th>
                        <th className="pb-3 font-medium">Dernière utilisation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {connections.map((connection) => (
                        <tr key={connection.id}>
                          <td className="py-4 pr-4">
                            <div className="font-semibold text-slate-900">{connection.label}</div>
                            <div className="mt-1 text-xs text-slate-500">{connection.platform}</div>
                          </td>
                          <td className="py-4 pr-4">
                            <Badge tone={connectionTone(connection.status)}>
                              {connection.status}
                            </Badge>
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            {connection.usesEnvBearerToken
                              ? connection.envBearerTokenAvailable
                                ? "Token serveur détecté"
                                : "Variable serveur absente"
                              : connection.hasBearerToken
                                ? "Token chiffré présent"
                                : "Absent"}
                          </td>
                          <td className="py-4 text-slate-600">
                            {connection.lastUsedAt ? formatDateTime(connection.lastUsedAt) : "Jamais"}
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
                    <h2 className="text-lg font-semibold text-slate-950">Règles Recent Search</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Chaque règle interroge l’API X officielle et peut être relancée à la demande.
                    </p>
                  </div>
                  <Badge tone="medium">{rules.length} règle(s)</Badge>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-[240px_1fr_160px_auto]">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Nom</label>
                    <Input
                      value={ruleForm.name}
                      onChange={(event) =>
                        setRuleForm((current) => ({ ...current, name: event.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Query</label>
                    <Input
                      value={ruleForm.query}
                      onChange={(event) =>
                        setRuleForm((current) => ({ ...current, query: event.target.value }))
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
                      value={ruleForm.checkIntervalMinutes}
                      onChange={(event) =>
                        setRuleForm((current) => ({
                          ...current,
                          checkIntervalMinutes: event.target.value
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={createRule}
                      disabled={submittingRule || !ruleForm.name || !ruleForm.query}
                    >
                      {submittingRule ? "Ajout..." : "Ajouter"}
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
                      {rules.map((rule) => (
                        <tr key={rule.id} className="align-top">
                          <td className="py-4 pr-4">
                            <div className="font-semibold text-slate-900">{rule.name}</div>
                            <div className="mt-1 text-xs text-slate-500">
                              {rule.active ? "Active" : "Inactive"}
                            </div>
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            <div className="max-w-xl">{rule.query}</div>
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            Toutes les {rule.checkIntervalMinutes} min
                          </td>
                          <td className="py-4 pr-4 text-slate-600">
                            {rule.lastCheckedAt ? formatDateTime(rule.lastCheckedAt) : "Jamais"}
                          </td>
                          <td className="py-4 text-right">
                            <Button
                              variant="secondary"
                              onClick={() => checkRuleNow(rule.id)}
                              disabled={runningRuleId === rule.id}
                            >
                              {runningRuleId === rule.id ? "Analyse..." : "Check now"}
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

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function connectionTone(status: ApiXConnection["status"]) {
  if (status === "ACTIVE") return "positive";
  if (status === "ERROR") return "critical";
  return "neutral";
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}
