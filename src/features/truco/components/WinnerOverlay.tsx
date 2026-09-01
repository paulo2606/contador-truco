import { GameState } from "../types";

interface WinnerOverlayProps {
  state: GameState;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export function WinnerOverlay({ state, onPlayAgain, onNewGame }: WinnerOverlayProps) {
  if (!state.winner) return null;
  const winnerName = state.teams[state.winner].name;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-emerald-950/90 px-6 backdrop-blur-sm">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border border-amber-400 bg-emerald-900 p-8 text-center shadow-2xl">
        <span className="text-5xl">🏆</span>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Vitória de</p>
          <h2 className="mt-1 text-3xl font-black text-white">{winnerName}</h2>
        </div>
        <p className="text-emerald-200">
          {state.scores.A} x {state.scores.B}
        </p>
        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="rounded-2xl bg-amber-400 px-4 py-3 font-bold text-emerald-950 transition hover:bg-amber-300 active:scale-[0.98]"
          >
            Jogar novamente
          </button>
          <button
            type="button"
            onClick={onNewGame}
            className="rounded-2xl border border-emerald-600 px-4 py-3 font-semibold text-emerald-100 transition hover:border-emerald-400"
          >
            Novo jogo
          </button>
        </div>
      </div>
    </div>
  );
}
