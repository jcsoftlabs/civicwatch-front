"use client";

import { useCallback, useEffect, useState } from "react";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { AppShell } from "@/components/layout/AppShell";
import { KeywordTable } from "@/components/keywords/KeywordTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import {
  civicWatchApi,
  normalizeKeyword,
  type ApiMonitoredProfile,
  type CreateKeywordInput
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Keyword } from "@/lib/mock-data";

const allPlatforms: CreateKeywordInput["platforms"] = [
  "X",
  "FACEBOOK",
  "INSTAGRAM",
  "WEB",
  "RSS",
  "NEWS",
  "CRAWLER"
];

const initialForm = {
  keyword: "",
  keywordType: "ALIAS" as CreateKeywordInput["keywordType"],
  priority: "MEDIUM" as CreateKeywordInput["priority"],
  monitoredProfileId: ""
};

export default function KeywordsPage() {
  const { token, selectedOrganizationId } = useAuth();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [profiles, setProfiles] = useState<ApiMonitoredProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [deletingKeywordId, setDeletingKeywordId] = useState<string | null>(null);

  const loadKeywords = useCallback(() => {
    if (!token || !selectedOrganizationId) return;

    setLoading(true);
    setError(null);
    Promise.all([
      civicWatchApi.keywords(token, selectedOrganizationId),
      civicWatchApi.monitoredProfiles(token, selectedOrganizationId)
    ])
      .then(([keywordData, profileData]) => {
        setKeywords(keywordData.map(normalizeKeyword));
        setProfiles(profileData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Impossible de charger les mots-clés."))
      .finally(() => setLoading(false));
  }, [selectedOrganizationId, token]);

  useEffect(() => {
    loadKeywords();
  }, [loadKeywords]);

  const submit = async () => {
    if (!token || !selectedOrganizationId) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await civicWatchApi.createKeyword(token, selectedOrganizationId, {
        keyword: form.keyword,
        keywordType: form.keywordType,
        priority: form.priority,
        monitoredProfileId: form.monitoredProfileId || undefined,
        active: true,
        platforms: allPlatforms
      });
      setForm(initialForm);
      setSuccess("Mot-cle ajoute. Il sera pris en compte dans les prochains cycles de surveillance.");
      loadKeywords();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'ajouter le mot-cle.");
    } finally {
      setSubmitting(false);
    }
  };

  const removeKeyword = async (keywordId: string) => {
    if (!token || !selectedOrganizationId) return;

    setDeletingKeywordId(keywordId);
    setError(null);
    setSuccess(null);

    try {
      await civicWatchApi.deleteKeyword(token, selectedOrganizationId, keywordId);
      setSuccess("Mot-cle supprime.");
      loadKeywords();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de supprimer le mot-cle.");
    } finally {
      setDeletingKeywordId(null);
    }
  };

  return (
    <ProtectedPage>
      <AppShell
        title="Gestion des mots-clés"
        subtitle="Configurez les termes, alias et sujets sensibles à surveiller"
      >
        <div className="space-y-6">
        <Card>
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px_260px_auto]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Ajouter un mot-clé
              </label>
              <Input
                value={form.keyword}
                onChange={(event) =>
                  setForm((current) => ({ ...current, keyword: event.target.value }))
                }
                placeholder="Ex. Fritz William Michel, Neg Kabrit La, corruption"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Type</label>
              <select
                value={form.keywordType}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    keywordType: event.target.value as CreateKeywordInput["keywordType"]
                  }))
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
              >
                <option value="NAME">Nom</option>
                <option value="COMPANY">Entreprise</option>
                <option value="HASHTAG">Hashtag</option>
                <option value="ALIAS">Alias</option>
                <option value="SENSITIVE_TOPIC">Sujet sensible</option>
                <option value="PARTY">Parti</option>
                <option value="OTHER">Autre</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Priorité
              </label>
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    priority: event.target.value as CreateKeywordInput["priority"]
                  }))
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
              >
                <option value="LOW">Faible</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Haute</option>
                <option value="CRITICAL">Critique</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Profil lie
              </label>
              <select
                value={form.monitoredProfileId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    monitoredProfileId: event.target.value
                  }))
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
              >
                <option value="">Aucun profil specifique</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={submit} disabled={submitting || !form.keyword}>
                {submitting ? "Ajout..." : "Ajouter"}
              </Button>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Les mots-cles deja precharges pour Fritz incluent son nom complet, son alias
            politique et plusieurs sujets sensibles. Cette page lui permet d’en ajouter d’autres
            a tout moment.
          </p>
        </Card>

        {success ? (
          <Card className="border-emerald-200 bg-emerald-50 text-emerald-900">{success}</Card>
        ) : null}
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={loadKeywords} /> : null}
        {!loading && !error ? (
          <Card className="overflow-hidden p-0">
            <div className="border-b border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-slate-950">Mots-cles surveilles</h3>
              <p className="text-sm text-slate-500">
                Couverture multi-plateformes avec hierarchisation par niveau de risque.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    {[
                      "Mot-cle",
                      "Type",
                      "Plateformes surveillees",
                      "Niveau de priorite",
                      "Statut",
                      "Action"
                    ].map((header) => (
                      <th key={header} className="px-5 py-3 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((keyword) => (
                    <tr key={keyword.id} className="border-t border-slate-100">
                      <td className="px-5 py-4 font-semibold text-slate-900">{keyword.label}</td>
                      <td className="px-5 py-4 text-slate-600">{keyword.type}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          {keyword.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-semibold text-white">
                          {keyword.priority === "low"
                            ? "Faible"
                            : keyword.priority === "medium"
                              ? "Moyenne"
                              : keyword.priority === "high"
                                ? "Haute"
                                : "Critique"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {keyword.active ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Button
                          variant="secondary"
                          onClick={() => removeKeyword(keyword.id)}
                          disabled={deletingKeywordId === keyword.id}
                        >
                          {deletingKeywordId === keyword.id ? "Suppression..." : "Supprimer"}
                        </Button>
                      </td>
                    </tr>
                  ))}
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
