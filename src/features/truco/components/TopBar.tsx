import { MODE_LABELS, VARIANT_RULES } from "../constants";
import { GameState } from "../types";

interface TopBarProps {
  state: GameState;
  canUndo: boolean;
  onUndo: () => void;
  onNewGame: () => void;
}

export function TopBar({ state, canUndo, onUndo, onNewGame }: TopBarProps) {
  return (
    <div className="flex items-center justify-between gap-2 text-emerald-200">
      <div className="text-sm">
        <p className="font-semibold text-white">{VARIANT_RULES[state.variant].label}</p>
        <p className="text-xs text-emerald-400">
          {MODE_LABELS[state.mode].title} · Mão {state.handNumber}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded-full border border-emerald-700 px-3 py-1.5 text-xs font-semibold transition hover:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Desfazer
        </button>
        <button
          type="button"
          onClick={onNewGame}
          className="rounded-full border border-emerald-700 px-3 py-1.5 text-xs font-semibold transition hover:border-rose-500 hover:text-rose-300"
        >
          Novo jogo
        </button>
      </div>
    </div>
  );
}
