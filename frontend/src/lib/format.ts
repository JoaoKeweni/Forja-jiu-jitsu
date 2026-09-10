// Utilidades de formatação pt-BR.

const currencyFmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

export function formatCurrency(value: number): string {
  return currencyFmt.format(value);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return dateFmt.format(date);
}

const MONTHS = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
export function monthShort(month: number): string {
  return MONTHS[month] ?? String(month);
}
