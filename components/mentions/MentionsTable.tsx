"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { Mention, Platform, Priority, Sentiment } from "@/lib/mock-data";
import { cn, formatDateTime } from "@/lib/utils";

const platformOptions: Array<Platform | "Tous"> = ["Tous", "X", "Facebook", "Instagram", "Web", "RSS", "News"];
const sentimentOptions: Array<"Tous" | Sentiment> = [
  "Tous",
  "positive",
  "neutral",
  "negative"
];
const priorityOptions: Array<"Tous" | Priority> = [
  "Tous",
  "low",
  "medium",
  "high",
  "critical"
];

export interface MentionFilters {
  platform: Platform | "Tous";
  sentiment: "Tous" | Sentiment;
  priority: "Tous" | Priority;
  query: string;
}

export function MentionsTable({
  data,
  serverMode = false,
  onFiltersChange
}: {
  data: Mention[];
  serverMode?: boolean;
  onFiltersChange?: (filters: MentionFilters) => void;
}) {
  const [platform, setPlatform] = useState<Platform | "Tous">("Tous");
  const [sentiment, setSentiment] = useState<"Tous" | Sentiment>("Tous");
  const [priority, setPriority] = useState<"Tous" | Priority>("Tous");
  const [query, setQuery] = useState("");

  const filters = useMemo(
    () => ({ platform, sentiment, priority, query }),
    [platform, sentiment, priority, query]
  );

  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const filtered = useMemo(() => {
    if (serverMode) {
      return data;
    }

    return data.filter((item) => {
      const matchesPlatform = platform === "Tous" || item.platform === platform;
      const matchesSentiment = sentiment === "Tous" || item.sentiment === sentiment;
      const matchesPriority = priority === "Tous" || item.priority === priority;
      const matchesQuery =
        query.trim().length === 0 ||
        [
          item.authorName,
          item.authorHandle,
          item.content,
          item.keyword
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());

      return matchesPlatform && matchesSentiment && matchesPriority && matchesQuery;
    });
  }, [data, platform, sentiment, priority, query, serverMode]);

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-200 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Mentions détectées</h3>
            <p className="text-sm text-slate-500">
              Recherche rapide, filtres visuels et priorisation des signaux.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              label="Plateforme"
              value={platform}
              options={platformOptions}
              onChange={(value) => setPlatform(value as Platform | "Tous")}
            />
            <FilterSelect
              label="Sentiment"
              value={sentiment}
              options={sentimentOptions}
              onChange={(value) => setSentiment(value as "Tous" | Sentiment)}
            />
            <FilterSelect
              label="Priorité"
              value={priority}
              options={priorityOptions}
              onChange={(value) => setPriority(value as "Tous" | Priority)}
            />
            <div className="min-w-[220px] flex-1">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Recherche
              </label>
              <Input
                placeholder="Nom, contenu, mot-clé..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-transparent">
                Action
              </label>
              <Button variant="secondary">Exporter</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {[
                "Plateforme",
                "Auteur",
                "Contenu",
                "Mot-clé détecté",
                "Sentiment",
                "Priorité",
                "Date",
                "Statut"
              ].map((header) => (
                <th key={header} className="px-5 py-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className="px-5 py-10 text-center text-slate-500" colSpan={8}>
                  Aucune mention ne correspond aux filtres actuels.
                </td>
              </tr>
            ) : (
              filtered.map((mention) => (
                <tr key={mention.id} className="border-t border-slate-100 align-top">
                  <td className="px-5 py-4">
                    <Badge tone={platformTone(mention.platform)}>
                      {mention.platform}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">{mention.authorName}</div>
                    <div className="text-slate-500">{mention.authorHandle}</div>
                  </td>
                  <td className="max-w-sm px-5 py-4 text-slate-700">{mention.content}</td>
                  <td className="px-5 py-4 font-medium text-slate-900">{mention.keyword}</td>
                  <td className="px-5 py-4">
                    <Badge tone={mention.sentiment}>
                      {labelSentiment(mention.sentiment)}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={mention.priority}>{labelPriority(mention.priority)}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                    {formatDateTime(mention.detectedAt)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={mention.status}>{labelStatus(mention.status)}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function platformTone(platform: Platform) {
  return platform === "X" ? "x" : platform === "Facebook" ? "facebook" : "medium";
}

function FilterSelect({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-[150px]">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <select
        className={cn(
          "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
        )}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "positive"
              ? "Positif"
              : option === "neutral"
                ? "Neutre"
                : option === "negative"
                  ? "Négatif"
                  : labelPriority(option as Priority) ?? option}
          </option>
        ))}
      </select>
    </div>
  );
}

function labelPriority(priority: Priority | string) {
  switch (priority) {
    case "low":
      return "Faible";
    case "medium":
      return "Moyenne";
    case "high":
      return "Haute";
    case "critical":
      return "Critique";
    default:
      return priority;
  }
}

function labelSentiment(sentiment: Sentiment) {
  switch (sentiment) {
    case "positive":
      return "Positif";
    case "neutral":
      return "Neutre";
    case "negative":
      return "Négatif";
  }
}

function labelStatus(status: string) {
  switch (status) {
    case "new":
      return "Nouveau";
    case "reviewing":
      return "En cours";
    case "resolved":
      return "Traité";
    default:
      return status;
  }
}
