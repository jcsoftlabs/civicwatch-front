import { AppShell } from "@/components/layout/AppShell";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <ProtectedPage>
      <AppShell
        title="Paramètres de la démo"
        subtitle="Configuration client, canaux de notification et limites de démonstration"
      >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h3 className="text-lg font-semibold text-slate-950">Informations du client</h3>
          <div className="mt-5 space-y-4 text-sm">
            <Field label="Nom surveillé" value="Jean Exemple" />
            <Field label="Organisation" value="Entreprise Horizon" />
            <Field label="Email alerte" value="alerts@example.com" />
            <Field label="Téléphone alerte" value="+1 555 000 1234" />
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
            <h3 className="text-lg font-semibold text-slate-950">Fréquence</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-sm text-slate-500">X</div>
                <div className="mt-2 text-lg font-semibold text-slate-950">Temps réel</div>
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
            <h3 className="text-lg font-semibold">Limites de la démo</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Les données affichées sont fictives. En production, les résultats dépendront des permissions API, des limites X/Meta et des règles de conformité.
            </p>
          </Card>
        </div>
      </div>
      </AppShell>
    </ProtectedPage>
  );
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
