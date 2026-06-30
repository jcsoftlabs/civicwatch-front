import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeTone =
  | "low"
  | "medium"
  | "high"
  | "critical"
  | "positive"
  | "neutral"
  | "negative"
  | "x"
  | "facebook"
  | "new"
  | "reviewing"
  | "resolved";

const tones: Record<BadgeTone, string> = {
  low: "bg-slate-100 text-slate-700 border border-slate-200",
  medium: "bg-blue-50 text-blue-700 border border-blue-200",
  high: "bg-orange-50 text-orange-700 border border-orange-200",
  critical: "bg-red-50 text-red-700 border border-red-200",
  positive: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  neutral: "bg-slate-100 text-slate-700 border border-slate-200",
  negative: "bg-red-50 text-red-700 border border-red-200",
  x: "bg-slate-900 text-white border border-slate-900",
  facebook: "bg-blue-600 text-white border border-blue-600",
  new: "bg-red-50 text-red-700 border border-red-200",
  reviewing: "bg-amber-50 text-amber-700 border border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200"
};

export function Badge({
  tone,
  children,
  className
}: {
  tone: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
