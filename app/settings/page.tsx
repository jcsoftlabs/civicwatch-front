"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
  const { user, organizations, selectedOrganizationId } = useAuth();
  const selectedOrganization =
    organizations.find((organization) => organization.id === selectedOrganizationId) ??
    organizations[0] ??
    null;
  const selectedRole = formatRole(selectedOrganization?.role);

  return (
    <ProtectedPage>
      <AppShell
        title="Paramètres client"
        subtitle="Configuration de l’espace surveillé, gouvernance d’accès et cadre opérationnel"
      >
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <h3 className="text-lg font-semibold text-slate-950">Informations du client</h3>
            <div className="mt-5 space-y-4 text-sm">
              <Field label="Compte connecte" value={user?.fullName ?? "Compte non charge"} />
              <Field label="Email operateur" value={user?.email ?? "Email non charge"} />
              <Field
                label="Organisation surveillee"
                value={selectedOrganization?.name ?? "Organisation non selectionnee"}
              />
              <Field label="Role operationnel" value={selectedRole} />
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-slate-950">Canaux de notification</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Channel name="Email" enabled />
                <Channel name="SMS" enabled />
                <Channel name="WhatsApp" enabled />
                <Channel name="Telegram" enabled={false} />
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-slate-950">Frequence</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">X</div>
                  <div className="mt-2 text-lg font-semibold text-slate-950">Temps reel</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Facebook</div>
                  <div className="mt-2 text-lg font-semibold text-slate-950">
                    Toutes les 5 minutes
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-slate-900 bg-slate-950 text-white">
              <h3 className="text-lg font-semibold">Cadre de production</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Les resultats dependent des sources activees, des permissions API, du respect
                des politiques de plateformes et des garde-fous de conformite configures sur
                l’instance.
              </p>
            </Card>
          </div>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}

function formatRole(role?: string) {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super administrateur";
    case "ORG_ADMIN":
      return "Administrateur organisation";
    case "ANALYST":
      return "Analyste";
    case "VIEWER":
      return "Lecteur";
    default:
      return "Role non disponible";
  }
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-base font-medium text-slate-900">{value}</div>
    </div>
  );
}

function Channel({ name, enabled }: { name: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <span className="font-medium text-slate-800">{name}</span>
      <Badge tone={enabled ? "resolved" : "neutral"}>
        {enabled ? "Activé" : "Désactivé"}
      </Badge>
    </div>
  );
}
