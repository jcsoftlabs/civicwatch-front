import { Card } from "@/components/ui/Card";
import type { WeeklyStat } from "@/lib/mock-data";

export function MentionsChart({ data }: { data: WeeklyStat[] }) {
  const max = Math.max(...data.map((item) => item.mentions));

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Mentions sur 7 jours</h3>
          <p className="text-sm text-slate-500">
            Vue synthétique des volumes et des signaux critiques.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Mise à jour il y a 42 sec
        </div>
      </div>
      <div className="mt-8 grid h-72 grid-cols-7 items-end gap-3">
        {data.map((item) => {
          const height = Math.max((item.mentions / max) * 100, 12);
          const criticalHeight = Math.max((item.critical / 10) * 100, 8);

          return (
            <div key={item.day} className="flex h-full flex-col items-center justify-end gap-3">
              <div className="flex h-full w-full items-end gap-2">
                <div
                  className="w-full rounded-t-2xl bg-brand/90"
                  style={{ height: `${height}%` }}
                />
                <div
                  className="w-3 rounded-t-full bg-accent"
                  style={{ height: `${criticalHeight}%` }}
                />
              </div>
              <div className="text-xs font-semibold text-slate-500">{item.day}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-brand/90" />
          Mentions totales
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-accent" />
          Mentions critiques
        </div>
      </div>
    </Card>
  );
}
