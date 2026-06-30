"use client";

import { useEffect, useState } from "react";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { AppShell } from "@/components/layout/AppShell";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { MentionsChart } from "@/components/dashboard/MentionsChart";
import { PlatformCard } from "@/components/dashboard/PlatformCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { civicWatchApi, normalizeDashboard } from "@/lib/api";
import type { DashboardStats } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatRelativeHour } from "@/lib/utils";

export default function DashboardPage() {
  const { token, selectedOrganizationId } = useAuth();
  const [stats, setStats] = useState<ReturnType<typeof normalizeDashboard> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !selectedOrganizationId) return;

    setLoading(true);
    setError(null);
    civicWatchApi
      .dashboard(token, selectedOrganizationId)
      .then((data: DashboardStats) => setStats(normalizeDashboard(data)))
      .catch((err) => setError(err instanceof Error ? err.message : "Impossible de charger le dashboard."))
      .finally(() => setLoading(false));
  }, [selectedOrganizationId, token]);

  return (
    <ProtectedPage>
      <AppShell
        title="CivicWatch Demo"
        subtitle="Vue d’ensemble du monitoring politique et réputationnel"
      >
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => window.location.reload()} /> : null}
        {!loading && !error && stats ? <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            label="Mentions aujourd’hui"
            value={String(stats.cards.mentionsToday)}
            detail="Données backend"
          />
          <StatsCard
            label="Mentions critiques"
            value={String(stats.cards.criticalMentions)}
            detail="Priorité critique"
            tone="critical"
          />
          <StatsCard
            label="Sentiment négatif"
            value={`${stats.cards.negativeSentiment}%`}
            detail="Segment à surveiller"
          />
          <StatsCard
            label="Temps moyen de détection"
            value={`${stats.cards.detectionTimeSeconds}s`}
            detail="Flux prioritaire X"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <MentionsChart data={stats.weeklyStats} />
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-slate-950">Répartition par plateforme</h3>
              <div className="mt-5 grid gap-4">
                {stats.platformStats.map((item) => (
                  <PlatformCard key={item.platform} item={item} />
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-950">Dernières mentions</h3>
              <Badge tone="medium">Flux temps réel</Badge>
            </div>
            <div className="mt-5 space-y-4">
              {stats.latestMentions.slice(0, 5).map((mention) => (
                <div
                  key={mention.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={mention.platform === "X" ? "x" : mention.platform === "Facebook" ? "facebook" : "medium"}>
                      {mention.platform}
                    </Badge>
                    <Badge tone={mention.priority}>
                      {mention.priority === "critical"
                        ? "Critique"
                        : mention.priority === "high"
                          ? "Haute"
                          : mention.priority === "medium"
                            ? "Moyenne"
                            : "Faible"}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {formatRelativeHour(mention.detectedAt)}
                    </span>
                  </div>
                  <div className="mt-3 text-sm font-semibold text-slate-900">
                    {mention.authorName} <span className="font-normal text-slate-500">{mention.authorHandle}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{mention.content}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="border-red-100 bg-red-50/70">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-950">Alertes critiques</h3>
                <Badge tone="critical">Priorité haute</Badge>
              </div>
              <div className="mt-5 space-y-4">
                {stats.criticalAlerts
                  .map((alert) => (
                    <div key={alert.id} className="rounded-2xl border border-red-100 bg-white p-4">
                      <div className="text-sm font-semibold text-slate-950">{alert.shortMessage}</div>
                      <p className="mt-2 text-sm text-slate-600">{alert.postExcerpt}</p>
                    </div>
                  ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-950">Mots-clés les plus actifs</h3>
                <Badge tone="medium">Top 5</Badge>
              </div>
              <div className="mt-5 space-y-3">
                {stats.topKeywords.map((keyword, index) => (
                  <div key={keyword.keyword} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <div>
                      <div className="font-semibold text-slate-900">{keyword.keyword}</div>
                      <div className="text-sm text-slate-500">Mot-clé actif</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-900">{keyword.count} mentions</div>
                      <Badge tone={index === 0 ? "critical" : "medium"} className="mt-1">
                        top {index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
        </div> : null}
      </AppShell>
    </ProtectedPage>
  );
}
