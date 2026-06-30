import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function StatsCard({
  label,
  value,
  detail,
  tone = "default"
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "critical";
}) {
  return (
    <Card className={cn(tone === "critical" && "border-red-100 bg-red-50/70")}>
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-slate-950">{value}</div>
      <div
        className={cn(
          "mt-2 text-sm",
          tone === "critical" ? "text-red-700" : "text-slate-500"
        )}
      >
        {detail}
      </div>
    </Card>
  );
}
