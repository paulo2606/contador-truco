import { canRaise } from "../engine";
import { GameState, TeamId } from "../types";

interface HandControlsProps {
  state: GameState;
  onCall: (team: TeamId) => void;
  onAccept: () => void;
  onRun: () => void;
  onWin: (team: TeamId) => void;
  onTie: () => void;
}

export function HandControls({ state, onCall, onAccept, onRun, onWin, onTie }: HandControlsProps) {
  const { call } = state;

  if (call.status === "pending" && call.calledBy) {
    return (
      <div className="flex flex-col gap-3 rounded-3xl border border-amber-400/60 bg-emerald-950/60 p-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onAccept}
            className="rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-500 active:scale-[0.98]"
          >
            Aceitar
          </button>
          <button
            type="button"
            onClick={onRun}
            disabled={!call.canRun}
            title={call.canRun ? undefined : "Não é possível correr na mão de ouro"}
            className="rounded-2xl bg-rose-700 px-4 py-3 font-bold text-white transition hover:bg-rose-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Correr
          </button>
        </div>
        {canRaise(state) && (
          <button
            type="button"
            onClick={() => onCall(call.calledBy === "A" ? "B" : "A")}
            className="rounded-2xl border border-amber-400 px-4 py-2 font-semibold text-amber-300 transition hover:bg-amber-400/10 active:scale-[0.98]"
          >
            Aumentar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onCall("A")}
          disabled={!canRaise(state)}
          className="rounded-2xl border border-amber-400 px-3 py-3 font-bold text-amber-300 transition hover:bg-amber-400/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
        >
          Truco: {state.teams.A.name}
        </button>
        <button
          type="button"
          onClick={() => onCall("B")}
          disabled={!canRaise(state)}
          className="rounded-2xl border border-amber-400 px-3 py-3 font-bold text-amber-300 transition hover:bg-amber-400/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
        >
          Truco: {state.teams.B.name}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onWin("A")}
          className="rounded-2xl bg-emerald-600 px-3 py-3 font-bold text-white transition hover:bg-emerald-500 active:scale-[0.98]"
        >
          {state.teams.A.name} venceu
        </button>
        <button
          type="button"
          onClick={() => onWin("B")}
          className="rounded-2xl bg-emerald-600 px-3 py-3 font-bold text-white transition hover:bg-emerald-500 active:scale-[0.98]"
        >
          {state.teams.B.name} venceu
        </button>
      </div>
      <button
        type="button"
        onClick={onTie}
        className="rounded-2xl border border-emerald-700 px-3 py-2 text-sm font-semibold text-emerald-300 transition hover:border-emerald-500"
      >
        Mão empatada
      </button>
    </div>
  );
}
