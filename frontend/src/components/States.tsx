import { Loader2, AlertCircle, Inbox } from "lucide-react";
import { apiError } from "../api/client";

export function Loading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-on-surface-variant">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorMessage({ error }: { error: unknown }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-error-container/30 px-4 py-3 text-sm text-on-error-container">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{apiError(error)}</span>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-on-surface-variant">
      <Inbox className="h-8 w-8 opacity-60" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
