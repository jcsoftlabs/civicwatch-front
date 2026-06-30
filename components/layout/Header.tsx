"use client";

import { Button } from "@/components/ui/Button";
import type { ApiOrganization } from "@/lib/api";

export function Header({
  title,
  subtitle,
  onMenuToggle,
  organizations = [],
  selectedOrganizationId,
  onOrganizationChange,
  onLogout
}: {
  title: string;
  subtitle: string;
  onMenuToggle: () => void;
  organizations?: ApiOrganization[];
  selectedOrganizationId?: string | null;
  onOrganizationChange?: (organizationId: string) => void;
  onLogout?: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
            onClick={onMenuToggle}
            type="button"
            aria-label="Ouvrir la navigation"
          >
            <span className="text-lg">☰</span>
          </button>
          <div>
            <div className="text-lg font-semibold text-slate-950">{title}</div>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          {organizations.length > 1 ? (
            <select
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
              value={selectedOrganizationId ?? ""}
              onChange={(event) => onOrganizationChange?.(event.target.value)}
              aria-label="Changer d'organisation"
            >
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </select>
          ) : null}
          <Button href="/alerts" variant="secondary">
            Voir les alertes
          </Button>
          <Button href="/reports">Résumé hebdomadaire</Button>
          {onLogout ? (
            <Button variant="secondary" onClick={onLogout}>
              Déconnexion
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
