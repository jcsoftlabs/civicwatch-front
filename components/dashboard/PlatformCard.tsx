import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { PlatformStat } from "@/lib/mock-data";

export function PlatformCard({ item }: { item: PlatformStat }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Badge tone={item.platform === "X" ? "x" : "facebook"}>{item.platform}</Badge>
          <div className="text-3xl font-semibold text-slate-950">{item.value}%</div>
        </div>
        <div className="h-16 w-16 rounded-full border-8 border-slate-100 border-t-brand" />
      </div>
      <p className="mt-4 text-sm text-slate-500">{item.trend}</p>
    </Card>
  );
}
