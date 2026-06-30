"use client";

import { useCallback, useEffect, useState } from "react";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { AppShell } from "@/components/layout/AppShell";
import { MentionsTable } from "@/components/mentions/MentionsTable";
import type { MentionFilters } from "@/components/mentions/MentionsTable";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { civicWatchApi, normalizeMention } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Mention } from "@/lib/mock-data";

export default function MentionsPage() {
  const { token, selectedOrganizationId } = useAuth();
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [filters, setFilters] = useState<MentionFilters>({
    platform: "Tous",
    sentiment: "Tous",
    priority: "Tous",
    query: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMentions = useCallback(() => {
    if (!token || !selectedOrganizationId) return;

    setLoading(true);
    setError(null);
    civicWatchApi
      .mentions(token, selectedOrganizationId, {
        platform: filters.platform === "Tous" ? undefined : toBackendValue(filters.platform),
        sentiment: filters.sentiment === "Tous" ? undefined : toBackendValue(filters.sentiment),
        priority: filters.priority === "Tous" ? undefined : toBackendValue(filters.priority),
        search: filters.query,
        page: 1,
        limit: 50
      })
      .then((response) => setMentions(response.data.map(normalizeMention)))
      .catch((err) => setError(err instanceof Error ? err.message : "Impossible de charger les mentions."))
      .finally(() => setLoading(false));
  }, [filters, selectedOrganizationId, token]);

  useEffect(() => {
    loadMentions();
  }, [loadMentions]);

  const handleFiltersChange = useCallback((nextFilters: MentionFilters) => {
    setFilters((currentFilters) =>
      areFiltersEqual(currentFilters, nextFilters) ? currentFilters : nextFilters
    );
  }, []);

  return (
    <ProtectedPage>
      <AppShell
        title="Mentions détectées"
        subtitle="Filtrez les publications publiques surveillées sur X et Facebook"
      >
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={loadMentions} /> : null}
        {!loading && !error ? (
          <MentionsTable data={mentions} serverMode onFiltersChange={handleFiltersChange} />
        ) : null}
      </AppShell>
    </ProtectedPage>
  );
}

function toBackendValue(value: string) {
  return value.toUpperCase() === "FACEBOOK" ? "FACEBOOK" : value.toUpperCase();
}

function areFiltersEqual(currentFilters: MentionFilters, nextFilters: MentionFilters) {
  return (
    currentFilters.platform === nextFilters.platform &&
    currentFilters.sentiment === nextFilters.sentiment &&
    currentFilters.priority === nextFilters.priority &&
    currentFilters.query === nextFilters.query
  );
}
