import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Keyword } from "@/lib/mock-data";

export function KeywordTable({ data }: { data: Keyword[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-lg font-semibold text-slate-950">Mots-clés surveillés</h3>
        <p className="text-sm text-slate-500">
          Couverture multi-plateformes avec hiérarchisation par niveau de risque.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {[
                "Mot-clé",
                "Type",
                "Plateformes surveillées",
                "Niveau de priorité",
                "Statut"
              ].map((header) => (
                <th key={header} className="px-5 py-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((keyword) => (
              <tr key={keyword.id} className="border-t border-slate-100">
                <td className="px-5 py-4 font-semibold text-slate-900">{keyword.label}</td>
                <td className="px-5 py-4 text-slate-600">{keyword.type}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {keyword.platforms.map((platform) => (
                      <Badge key={platform} tone={platform === "X" ? "x" : platform === "Facebook" ? "facebook" : "medium"}>
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge tone={keyword.priority}>
                    {keyword.priority === "low"
                      ? "Faible"
                      : keyword.priority === "medium"
                        ? "Moyenne"
                        : keyword.priority === "high"
                          ? "Haute"
                          : "Critique"}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <Badge tone={keyword.active ? "resolved" : "neutral"}>
                    {keyword.active ? "Actif" : "Inactif"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
