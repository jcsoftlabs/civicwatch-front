"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  civicWatchApi,
  type ApiMonitoredProfile,
  type CreateKeywordInput,
  type CreateMonitoredProfileInput
} from "@/lib/api";
import { useAuth } from "@/lib/auth";

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
  displayName: "",
  profileType: "COMPANY" as CreateMonitoredProfileInput["profileType"],
  description: "",
  country: "Haiti",
  createKeyword: true
};

export default function ProfilesPage() {
  const { token, selectedOrganizationId } = useAuth();
  const [profiles, setProfiles] = useState<ApiMonitoredProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [savingProfileId, setSavingProfileId] = useState<string | null>(null);
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null);

  const loadProfiles = useCallback(() => {
    if (!token || !selectedOrganizationId) return;

    setLoading(true);
    setError(null);
    civicWatchApi
      .monitoredProfiles(token, selectedOrganizationId)
      .then((data) => setProfiles(data))
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Impossible de charger les profils surveilles."
        )
      )
      .finally(() => setLoading(false));
  }, [selectedOrganizationId, token]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const stats = useMemo(
    () => ({
      total: profiles.length,
      active: profiles.filter((profile) => profile.active).length,
      companies: profiles.filter((profile) => profile.profileType === "COMPANY").length
    }),
    [profiles]
  );

  const submit = async () => {
    if (!token || !selectedOrganizationId) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const createdProfile = await civicWatchApi.createMonitoredProfile(token, selectedOrganizationId, {
        displayName: form.displayName,
        profileType: form.profileType,
        description: form.description || undefined,
        country: form.country,
        active: true
      });

      if (form.createKeyword) {
        await civicWatchApi.createKeyword(token, selectedOrganizationId, {
          monitoredProfileId: createdProfile.id,
          keyword: createdProfile.displayName,
          keywordType: mapProfileTypeToKeywordType(createdProfile.profileType),
          priority: createdProfile.profileType === "COMPANY" ? "HIGH" : "MEDIUM",
          platforms: allPlatforms,
          active: true
        });
      }

      setForm(initialForm);
      setSuccess(
        form.createKeyword
          ? "Profil ajoute et mot-cle associe cree pour la surveillance."
          : "Profil ajoute. Vous pourrez lui rattacher des mots-cles ensuite."
      );
      loadProfiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'ajouter le profil surveille.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (profile: ApiMonitoredProfile) => {
    setEditingProfileId(profile.id);
    setForm({
      displayName: profile.displayName,
      profileType: profile.profileType,
      description: profile.description ?? "",
      country: profile.country,
      createKeyword: false
    });
    setSuccess(null);
    setError(null);
  };

  const cancelEditing = () => {
    setEditingProfileId(null);
    setForm(initialForm);
  };

  const saveEditing = async () => {
    if (!token || !selectedOrganizationId || !editingProfileId) return;

    setSavingProfileId(editingProfileId);
    setError(null);
    setSuccess(null);

    try {
      await civicWatchApi.updateMonitoredProfile(token, selectedOrganizationId, editingProfileId, {
        displayName: form.displayName,
        profileType: form.profileType,
        description: form.description || undefined,
        country: form.country,
        active: true
      });
      setSuccess("Profil mis a jour.");
      setEditingProfileId(null);
      setForm(initialForm);
      loadProfiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de mettre a jour le profil.");
    } finally {
      setSavingProfileId(null);
    }
  };

  const removeProfile = async (profileId: string) => {
    if (!token || !selectedOrganizationId) return;

    setDeletingProfileId(profileId);
    setError(null);
    setSuccess(null);

    try {
      await civicWatchApi.deleteMonitoredProfile(token, selectedOrganizationId, profileId);
      setSuccess("Profil supprime.");
      if (editingProfileId === profileId) {
        setEditingProfileId(null);
        setForm(initialForm);
      }
      loadProfiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de supprimer le profil.");
    } finally {
      setDeletingProfileId(null);
    }
  };

  return (
    <ProtectedPage>
      <AppShell
        title="Profils surveilles"
        subtitle="Gerer la personne, les entreprises, les marques et les entites que CivicWatch doit suivre."
      >
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <div className="text-sm text-slate-500">Profils total</div>
              <div className="mt-2 text-3xl font-semibold text-slate-950">{stats.total}</div>
            </Card>
            <Card>
              <div className="text-sm text-slate-500">Profils actifs</div>
              <div className="mt-2 text-3xl font-semibold text-slate-950">{stats.active}</div>
            </Card>
            <Card>
              <div className="text-sm text-slate-500">Entreprises suivies</div>
              <div className="mt-2 text-3xl font-semibold text-slate-950">{stats.companies}</div>
            </Card>
          </div>

          <Card>
            <div className="grid gap-4 lg:grid-cols-[1.2fr_220px_180px]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nom du profil
                </label>
                <Input
                  value={form.displayName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, displayName: event.target.value }))
                  }
                  placeholder="Ex. FWM Industries"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Type</label>
                <select
                  value={form.profileType}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      profileType: event.target.value as CreateMonitoredProfileInput["profileType"]
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
                >
                  <option value="PERSON">Personne</option>
                  <option value="COMPANY">Entreprise</option>
                  <option value="POLITICAL_PARTY">Parti politique</option>
                  <option value="BRAND">Marque</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Pays</label>
                <Input
                  value={form.country}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, country: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <Input
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="Ex. Filiale, marque, structure publique ou entite a surveiller"
                />
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input
                  checked={form.createKeyword}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, createKeyword: event.target.checked }))
                  }
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/20"
                />
                Creer aussi le mot-cle de recherche
              </label>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                Ajoutez ici les entreprises et entites de Fritz. Si la case est activee, leur nom
                devient automatiquement un critere de surveillance.
              </p>
              <div className="flex gap-3">
                {editingProfileId ? (
                  <Button variant="secondary" onClick={cancelEditing}>
                    Annuler
                  </Button>
                ) : null}
                <Button
                  onClick={editingProfileId ? saveEditing : submit}
                  disabled={
                    (editingProfileId ? savingProfileId === editingProfileId : submitting) ||
                    !form.displayName ||
                    !form.country
                  }
                >
                  {editingProfileId
                    ? savingProfileId === editingProfileId
                      ? "Enregistrement..."
                      : "Enregistrer"
                    : submitting
                      ? "Ajout..."
                      : "Ajouter le profil"}
                </Button>
              </div>
            </div>
          </Card>

          {success ? (
            <Card className="border-emerald-200 bg-emerald-50 text-emerald-900">{success}</Card>
          ) : null}

          {loading ? <LoadingState label="Chargement des profils surveilles..." /> : null}
          {error ? <ErrorState message={error} onRetry={loadProfiles} /> : null}

          {!loading && !error ? (
            <Card className="overflow-hidden p-0">
              <div className="border-b border-slate-200 p-5">
                <h2 className="text-lg font-semibold text-slate-950">Profils actifs</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Fritz peut enrichir cette liste au fur et a mesure de ses besoins.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Nom</th>
                      <th className="px-5 py-3 font-semibold">Type</th>
                      <th className="px-5 py-3 font-semibold">Pays</th>
                      <th className="px-5 py-3 font-semibold">Statut</th>
                      <th className="px-5 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile) => (
                      <tr key={profile.id} className="border-t border-slate-100">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900">{profile.displayName}</div>
                          {profile.description ? (
                            <div className="mt-1 text-xs text-slate-500">{profile.description}</div>
                          ) : null}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {formatProfileType(profile.profileType)}
                        </td>
                        <td className="px-5 py-4 text-slate-600">{profile.country}</td>
                        <td className="px-5 py-4">
                          <Badge tone={profile.active ? "resolved" : "neutral"}>
                            {profile.active ? "Actif" : "Inactif"}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => startEditing(profile)}>
                              Modifier
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => removeProfile(profile.id)}
                              disabled={deletingProfileId === profile.id}
                            >
                              {deletingProfileId === profile.id ? "Suppression..." : "Supprimer"}
                            </Button>
                          </div>
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

function formatProfileType(value: ApiMonitoredProfile["profileType"]) {
  switch (value) {
    case "PERSON":
      return "Personne";
    case "COMPANY":
      return "Entreprise";
    case "POLITICAL_PARTY":
      return "Parti politique";
    case "BRAND":
      return "Marque";
    default:
      return "Autre";
  }
}

function mapProfileTypeToKeywordType(
  value: ApiMonitoredProfile["profileType"]
): CreateKeywordInput["keywordType"] {
  switch (value) {
    case "PERSON":
      return "NAME";
    case "COMPANY":
      return "COMPANY";
    case "POLITICAL_PARTY":
      return "PARTY";
    case "BRAND":
      return "OTHER";
    default:
      return "OTHER";
  }
}
