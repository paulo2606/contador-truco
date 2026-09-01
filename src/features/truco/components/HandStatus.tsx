import { CALL_LABELS, HAND_LABELS } from "../constants";
import { GameState } from "../types";

interface HandStatusProps {
  state: GameState;
}

export function HandStatus({ state }: HandStatusProps) {
  const { call } = state;
  const pending = call.status === "pending" && call.calledBy;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <div
        className={`flex h-40 w-40 flex-col items-center justify-center rounded-full border-4 transition ${
          pending ? "border-amber-400 bg-emerald-800/60" : "border-emerald-700 bg-emerald-900/40"
        }`}
      >
        <span className="text-5xl font-black text-white">{pending ? call.value : state.handValue}</span>
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300">pontos</span>
      </div>
      <p className={`text-lg font-bold ${pending ? "text-amber-300" : "text-emerald-100"}`}>
        {pending ? `${state.teams[call.calledBy!].name} pediu ${CALL_LABELS[call.value]}` : HAND_LABELS[state.handValue]}
      </p>
      {state.goldenHand && (
        <p className="text-sm font-semibold text-amber-400">Não é possível correr nesta mão</p>
      )}
    </div>
  );
}
