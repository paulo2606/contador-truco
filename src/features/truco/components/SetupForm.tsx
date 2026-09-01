"use client";

import { FormEvent, useState } from "react";
import { MODE_LABELS, VARIANT_RULES } from "../constants";
import { GameConfig, GameMode, Variant } from "../types";

interface SetupFormProps {
  onStart: (config: GameConfig) => void;
  extraBottomSpace?: boolean;
}

const DEFAULT_NAMES: Record<GameMode, [string, string]> = {
  dupla: ["Dupla 1", "Dupla 2"],
  individual: ["Jogador 1", "Jogador 2"],
};

export function SetupForm({ onStart, extraBottomSpace }: SetupFormProps) {
  const [variant, setVariant] = useState<Variant>("paulista");
  const [mode, setMode] = useState<GameMode>("dupla");
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const [defaultA, defaultB] = DEFAULT_NAMES[mode];
    onStart({
      mode,
      variant,
      teams: {
        A: { id: "A", name: nameA.trim() || defaultA },
        B: { id: "B", name: nameB.trim() || defaultB },
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mx-auto flex w-full max-w-md flex-col gap-8 px-5 pt-10 text-emerald-50 transition-[padding] ${
        extraBottomSpace ? "pb-56" : "pb-10"
      }`}
    >
      <header className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Marcador de</p>
        <h1 className="mt-1 text-4xl font-bold text-white">Truco</h1>
      </header>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-emerald-300">
          Variante
        </legend>
        {(Object.keys(VARIANT_RULES) as Variant[]).map((key) => {
          const rule = VARIANT_RULES[key];
          const selected = variant === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setVariant(key)}
              aria-pressed={selected}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                selected
                  ? "border-amber-400 bg-emerald-800/80 shadow-[0_0_0_2px_rgba(251,191,36,0.4)]"
                  : "border-emerald-700 bg-emerald-900/40 hover:border-emerald-500"
              }`}
            >
              <span className="block font-semibold text-white">{rule.label}</span>
              <span className="mt-0.5 block text-sm text-emerald-200/80">{rule.description}</span>
            </button>
          );
        })}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-emerald-300">
          Número de jogadores
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(MODE_LABELS) as GameMode[]).map((key) => {
            const selected = mode === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                aria-pressed={selected}
                className={`rounded-2xl border px-3 py-4 text-center font-semibold transition ${
                  selected
                    ? "border-amber-400 bg-emerald-800/80 text-white shadow-[0_0_0_2px_rgba(251,191,36,0.4)]"
                    : "border-emerald-700 bg-emerald-900/40 text-emerald-100 hover:border-emerald-500"
                }`}
              >
                {MODE_LABELS[key].title}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-emerald-300">
          Nomes
        </legend>
        <label className="flex flex-col gap-1 text-sm text-emerald-200">
          Nome da {MODE_LABELS[mode].subject} 1
          <input
            value={nameA}
            onChange={(event) => setNameA(event.target.value)}
            placeholder={DEFAULT_NAMES[mode][0]}
            maxLength={24}
            className="rounded-xl border border-emerald-700 bg-emerald-950/60 px-3 py-2 text-white placeholder:text-emerald-500 focus:border-amber-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-emerald-200">
          Nome da {MODE_LABELS[mode].subject} 2
          <input
            value={nameB}
            onChange={(event) => setNameB(event.target.value)}
            placeholder={DEFAULT_NAMES[mode][1]}
            maxLength={24}
            className="rounded-xl border border-emerald-700 bg-emerald-950/60 px-3 py-2 text-white placeholder:text-emerald-500 focus:border-amber-400 focus:outline-none"
          />
        </label>
      </fieldset>

      <button
        type="submit"
        className="rounded-2xl bg-amber-400 px-4 py-3 text-lg font-bold text-emerald-950 shadow-lg transition hover:bg-amber-300 active:scale-[0.98]"
      >
        Começar partida
      </button>
    </form>
  );
}
