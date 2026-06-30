"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { AppShell } from "@/components/layout/AppShell";
import { ReportSummary } from "@/components/reports/ReportSummary";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import {
  civicWatchApi,
  normalizeMention,
  normalizeReport,
  reportRecommendations,
  type ApiReport
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Mention, ReportItem, SentimentStat } from "@/lib/mock-data";

export default function ReportsPage() {
  const { token, selectedOrganizationId } = useAuth();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [rawReports, setRawReports] = useState<ApiReport[]>([]);
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(() => {
    if (!token || !selectedOrganizationId) return;

    setLoading(true);
    setError(null);
    Promise.all([
      civicWatchApi.reports(token, selectedOrganizationId),
      civicWatchApi.mentions(token, selectedOrganizationId, { limit: 50 })
    ])
      .then(([reportData, mentionData]) => {
        setRawReports(reportData);
        setReports(reportData.map(normalizeReport));
        setMentions(mentionData.data.map(normalizeMention));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Impossible de charger les rapports."))
      .finally(() => setLoading(false));
  }, [selectedOrganizationId, token]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const sentimentStats = useMemo<SentimentStat[]>(() => {
    const total = mentions.length || 1;
    const positive = mentions.filter((mention) => mention.sentiment === "positive").length;
    const neutral = mentions.filter((mention) => mention.sentiment === "neutral").length;
    const negative = mentions.filter((mention) => mention.sentiment === "negative").length;

    return [
      { label: "Positif", value: Math.round((positive / total) * 100), tone: "positive" },
      { label: "Neutre", value: Math.round((neutral / total) * 100), tone: "neutral" },
      { label: "Négatif", value: Math.round((negative / total) * 100), tone: "negative" }
    ];
  }, [mentions]);

  const topKeywords = useMemo(() => {
    const counts = new Map<string, number>();
    mentions.forEach((mention) => counts.set(mention.keyword, (counts.get(mention.keyword) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [mentions]);

  const recommendations = useMemo(() => reportRecommendations(rawReports), [rawReports]);

  return (
    <ProtectedPage>
      <AppShell
        title="Rapports et analyse"
        subtitle="Résumé hebdomadaire, priorités et recommandations"
      >
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={loadReports} /> : null}
        {!loading && !error ? <div className="space-y-6">
        <ReportSummary reports={reports} sentiments={sentimentStats} />

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold text-slate-950">Top 5 mots-clés les plus mentionnés</h3>
            <div className="mt-5 space-y-4">
              {topKeywords.map(([label, volume]) => (
                <div key={label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{label}</span>
                    <span className="text-slate-500">{volume} mentions</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-brand"
                      style={{ width: `${Number(volume)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-950">Top 5 publications les plus sensibles</h3>
            <div className="mt-5 space-y-4">
              {mentions
                .filter((item) => item.priority === "critical" || item.priority === "high")
                .slice(0, 5)
                .map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="font-semibold text-slate-900">{item.authorName}</div>
                      <Badge tone={item.priority}>
                        {item.priority === "critical" ? "Critique" : "Haute"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.content}</p>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-slate-950">
            Recommandations automatiques fictives
          </h3>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {recommendations.map((item) => (
              <div key={item} className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <p className="text-sm leading-6 text-orange-900">{item}</p>
              </div>
            ))}
          </div>
        </Card>
        </div> : null}
      </AppShell>
    </ProtectedPage>
  );
}
