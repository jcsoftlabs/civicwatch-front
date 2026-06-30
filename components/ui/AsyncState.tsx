import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function LoadingState({ label = "Chargement des données..." }: { label?: string }) {
  return (
    <Card className="flex min-h-48 items-center justify-center">
      <div className="text-sm font-medium text-slate-500">{label}</div>
    </Card>
  );
}

export function ErrorState({
  title = "Impossible de charger les données",
  message,
  onRetry
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-red-100 bg-red-50/70">
      <h3 className="text-lg font-semibold text-red-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-red-800">{message}</p>
      {onRetry ? (
        <Button className="mt-4" variant="secondary" onClick={onRetry}>
          Réessayer
        </Button>
      ) : null}
    </Card>
  );
}
