// Geração de link wa.me pré-formatado para cobrança via WhatsApp.

/** Normaliza um telefone brasileiro para o formato E.164 sem símbolos (ex.: 5511999998888). */
export function normalizePhoneBR(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  // Adiciona o DDI 55 se ainda não estiver presente.
  return digits.startsWith("55") ? digits : `55${digits}`;
}

/** Monta a URL wa.me com a mensagem de cobrança pré-preenchida. */
export function whatsappChargeUrl(
  phone: string | null | undefined,
  studentName: string,
  monthLabel: string,
  amount: number
): string | null {
  const normalized = normalizePhoneBR(phone);
  if (!normalized) return null;

  const value = amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const message =
    `Olá, ${studentName}! Tudo bem? ` +
    `Passando para lembrar da mensalidade de ${monthLabel} no valor de ${value}. ` +
    `Assim que efetuar o pagamento (PIX ou presencial), é só avisar. Obrigado! 🥋`;

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

/** Link de contato simples (sem mensagem de cobrança). */
export function whatsappContactUrl(phone: string | null | undefined): string | null {
  const normalized = normalizePhoneBR(phone);
  return normalized ? `https://wa.me/${normalized}` : null;
}
