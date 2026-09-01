import { HandValue, Variant } from "./types";

export const HAND_SEQUENCE: HandValue[] = [1, 3, 6, 9, 12];

export const HAND_LABELS: Record<HandValue, string> = {
  1: "Valendo 1",
  3: "Truco",
  6: "Seis",
  9: "Nove",
  12: "Doze",
};

export const CALL_LABELS: Record<HandValue, string> = {
  1: "Valendo 1",
  3: "Truco!",
  6: "Seis!",
  9: "Nove!",
  12: "Doze!",
};

interface VariantRules {
  label: string;
  description: string;
  /** Score at which the "mão de ouro" (forced hand) rule triggers. */
  goldenHandScore: number;
  goldenHandLabel: string;
}

export const VARIANT_RULES: Record<Variant, VariantRules> = {
  paulista: {
    label: "Truco Paulista",
    description:
      "Baralho de 40 cartas com manilhas definidas pela vira. A mão de 11 força a jogada valendo truco.",
    goldenHandScore: 11,
    goldenHandLabel: "Mão de 11",
  },
  mineiro: {
    label: "Truco Mineiro",
    description:
      "Variante mineira, com a mão de 10 forçando a jogada valendo truco antes da reta final.",
    goldenHandScore: 10,
    goldenHandLabel: "Mão de 10",
  },
};

export const MODE_LABELS: Record<"dupla" | "individual", { title: string; subject: string }> = {
  dupla: { title: "Dupla (2x2)", subject: "dupla" },
  individual: { title: "Individual (1x1)", subject: "jogador" },
};

export function nextHandValue(current: HandValue): HandValue | null {
  const idx = HAND_SEQUENCE.indexOf(current);
  return idx >= 0 && idx < HAND_SEQUENCE.length - 1 ? HAND_SEQUENCE[idx + 1] : null;
}

export const STORAGE_KEY = "truco-marcador:v1";
