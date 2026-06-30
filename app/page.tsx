import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const features = [
  "Détection automatique des mentions",
  "Monitoring X",
  "Monitoring Facebook",
  "Alertes instantanées",
  "Analyse de sentiment",
  "Priorisation des risques",
  "Historique consultable",
  "Rapports hebdomadaires",
  "Support multi-plateformes",
  "Préparation à la gestion de crise",
  "Historique et preuve"
];

const steps = [
  "Ajouter les mots-clés à surveiller",
  "Le système détecte les mentions publiques accessibles",
  "Les alertes sont envoyées automatiquement",
  "L’équipe de communication traite les cas sensibles"
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="bg-hero-grid text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100">
                CivicWatch Demo • Veille réputationnelle et politique
              </div>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
                Protégez votre réputation publique en temps réel
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                CivicWatch aide les personnalités publiques, organisations et équipes de communication à détecter rapidement les mentions sensibles, analyser le sentiment public et réagir avant qu’une situation ne devienne une crise.
              </p>
              <div className="mt-8">
                <h2 className="text-2xl font-semibold">
                  Surveillance intelligente des mentions publiques
                </h2>
                <p className="mt-3 max-w-2xl text-base text-slate-200">
                  Détectez en temps réel les publications qui mentionnent votre nom, votre organisation ou vos mots-clés sensibles sur X et Facebook.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/dashboard">Voir le dashboard</Button>
                <Button href="/alerts" variant="ghost">
                  Voir les alertes
                </Button>
              </div>
            </div>

            <Card
              className="border-white/10 p-6 text-white backdrop-blur-xl"
              style={{ backgroundColor: "rgba(15, 23, 42, 0.72)" }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Sources suivies", "X + Facebook"],
                  ["Temps moyen de détection", "42 secondes"],
                  ["Mentions aujourd'hui", "128"],
                  ["Alertes critiques", "9"]
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 p-5 shadow-2xl shadow-slate-950/20"
                    style={{ backgroundColor: "rgba(2, 6, 23, 0.72)" }}
                  >
                    <div className="text-sm text-slate-200">{label}</div>
                    <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
                  </div>
                ))}
              </div>
              <div
                className="mt-6 rounded-2xl border border-orange-300/30 p-5"
                style={{ backgroundColor: "rgba(15, 23, 42, 0.82)" }}
              >
                <div className="text-sm font-semibold uppercase tracking-wide text-orange-200">
                  Signal prioritaire
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-100">
                  Les mots-clés liés à Horizon et à la campagne 2026 montrent une intensification du sentiment négatif sur X depuis la fin d’après-midi.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold text-slate-950">Fonctionnalités clés</h2>
          <p className="mt-3 text-lg text-slate-600">
            Une interface premium pensée pour la surveillance, la communication sensible et la gestion de crise.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature} className="bg-white">
              <div className="text-lg font-semibold text-slate-950">{feature}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Vue consolidée, priorisation claire et historique exploitable par une cellule de communication.
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white/70">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-semibold text-slate-950">Comment ça fonctionne</h2>
              <p className="mt-3 text-lg text-slate-600">
                Une démonstration claire du parcours opérationnel d’une veille automatisée.
              </p>
            </div>
            <div className="grid gap-4">
              {steps.map((step, index) => (
                <Card key={step} className="flex gap-4 bg-white">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-lg font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-950">{step}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Workflow pensé pour permettre une détection rapide, une qualification du risque et une réponse coordonnée.
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <Card className="border-slate-200 bg-slate-950 text-white">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold">Préparation à la gestion de crise</h2>
              <p className="mt-4 max-w-2xl text-slate-300">
                Détection automatique des mentions, alertes instantanées, analyse de sentiment, priorisation des risques, historique consultable, rapports hebdomadaires, support multi-plateformes et préparation à la gestion de crise.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300">
              Cette démo utilise des données fictives. Les intégrations réelles dépendent des APIs officielles de X et Meta.
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
