"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/lib/auth";

export function AppShell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { organizations, selectedOrganizationId, selectOrganization, logout } = useAuth();

  return (
    <div className="min-h-screen md:grid md:grid-cols-[288px_minmax(0,1fr)]">
      <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      <div className="min-w-0">
        <Header
          title={title}
          subtitle={subtitle}
          onMenuToggle={() => setMobileOpen((value) => !value)}
          organizations={organizations}
          selectedOrganizationId={selectedOrganizationId}
          onOrganizationChange={selectOrganization}
          onLogout={logout}
        />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
