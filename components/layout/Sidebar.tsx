"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Mentions", href: "/mentions" },
  { label: "Alertes", href: "/alerts" },
  { label: "Mots-clés", href: "/keywords" },
  { label: "Flux RSS", href: "/rss" },
  { label: "Web & News", href: "/web-news" },
  { label: "Rapports", href: "/reports" },
  { label: "Paramètres", href: "/settings" }
];

export function Sidebar({
  mobileOpen,
  onNavigate
}: {
  mobileOpen: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/30 transition md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onNavigate}
      />
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-white/10 bg-ink px-5 py-6 text-white shadow-2xl transition md:sticky md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Link href="/" className="mb-8 block" onClick={onNavigate}>
          <div className="text-xs uppercase tracking-[0.3em] text-blue-200/70">
            Monitoring Politique
          </div>
          <div className="mt-2 text-2xl font-semibold">CivicWatch Demo</div>
        </Link>

        <nav className="space-y-2">
          {items.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-white text-ink"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">Veille active</div>
          <p className="mt-2 text-sm text-slate-300">
            X en temps réel, Facebook toutes les 5 minutes, avec priorisation des signaux critiques.
          </p>
        </div>
      </aside>
    </>
  );
}
