import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ReportItem, SentimentStat } from "@/lib/mock-data";

export function ReportSummary({
  reports,
  sentiments
}: {
  reports: ReportItem[];
  sentiments: SentimentStat[];
}) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Résumé hebdomadaire</h3>
            <p className="text-sm text-slate-500">
              Synthèse exécutive destinée à l’équipe communication et au client.
            </p>
          </div>
          <Button variant="secondary">Générer rapport PDF</Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {sentiments.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-sm text-slate-500">{item.label}</div>
              <div className="mt-2 text-3xl font-semibold text-slate-950">{item.value}%</div>
              <div className="mt-4 h-2 rounded-full bg-white">
                <div
                  className={
                    item.tone === "positive"
                      ? "h-2 rounded-full bg-emerald-500"
                      : item.tone === "negative"
                        ? "h-2 rounded-full bg-red-500"
                        : "h-2 rounded-full bg-slate-400"
                  }
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {reports.map((item) => (
          <Card key={item.id}>
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-lg font-semibold text-slate-950">{item.title}</h4>
              <Badge tone={item.impact === "Élevé" ? "critical" : "medium"}>
                Impact {item.impact}
              </Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
