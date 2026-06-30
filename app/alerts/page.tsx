"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCard } from "@/components/alerts/AlertCard";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorState, LoadingState } from "@/components/ui/AsyncState";
import { civicWatchApi, normalizeAlert } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Alert } from "@/lib/mock-data";

export default function AlertsPage() {
  const { token, selectedOrganizationId } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = useCallback(() => {
    if (!token || !selectedOrganizationId) return;

    setLoading(true);
    setError(null);
    civicWatchApi
      .alerts(token, selectedOrganizationId)
      .then((data) => setAlerts(data.map(normalizeAlert)))
      .catch((err) => setError(err instanceof Error ? err.message : "Impossible de charger les alertes."))
      .finally(() => setLoading(false));
  }, [selectedOrganizationId, token]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  async function acknowledge(alertId: string) {
    if (!token || !selectedOrganizationId) return;

    try {
      await civicWatchApi.acknowledgeAlert(token, selectedOrganizationId, alertId);
      loadAlerts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de traiter cette alerte.");
    }
  }

  return (
    <ProtectedPage>
      <AppShell
        title="Centre des alertes"
        subtitle="Qualification des signaux critiques, importants et normaux"
      >
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={loadAlerts} /> : null}
        {!loading && !error ? (
          <div className="space-y-6">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledge} />
            ))}
          </div>
        ) : null}
      </AppShell>
    </ProtectedPage>
  );
}
