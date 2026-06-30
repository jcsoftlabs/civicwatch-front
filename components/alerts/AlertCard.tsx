import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Alert } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export function AlertCard({
  alert,
  onAcknowledge
}: {
  alert: Alert;
  onAcknowledge?: (alertId: string) => void;
}) {
  return (
    <Card
      className={
        alert.severity === "critical"
          ? "border-red-100 bg-gradient-to-br from-red-50 to-white"
          : ""
      }
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={alert.severity}>
              {alert.severity === "critical"
                ? "Alerte critique"
                : alert.severity === "high"
                  ? "Alerte importante"
                  : "Alerte normale"}
            </Badge>
            <Badge tone={alert.platform === "X" ? "x" : alert.platform === "Facebook" ? "facebook" : "medium"}>{alert.platform}</Badge>
            <Badge tone={alert.status}>
              {alert.status === "new"
                ? "Nouveau"
                : alert.status === "reviewing"
                  ? "En cours"
                  : "Traité"}
            </Badge>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-950">{alert.shortMessage}</h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{alert.postExcerpt}</p>
          </div>
          <div className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2 xl:grid-cols-4">
            <Meta label="Mot-clé déclencheur" value={alert.keyword} />
            <Meta label="Heure de détection" value={formatDateTime(alert.detectedAt)} />
            <Meta label="Canal d'alerte" value={alert.channel} />
            <Meta label="Post détecté" value="Publication publique surveillée" />
          </div>
        </div>
        <div className="flex shrink-0 flex-row gap-3 md:flex-col">
          <Button variant="secondary" onClick={() => onAcknowledge?.(alert.id)}>
            Marquer comme traité
          </Button>
          <Button href={alert.postUrl}>Voir le post</Button>
        </div>
      </div>
    </Card>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 font-medium text-slate-700">{value}</div>
    </div>
  );
}
