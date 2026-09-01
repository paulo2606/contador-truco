import { VARIANT_RULES } from "../constants";
import { GameState, TeamId } from "../types";

interface ScoreBoardProps {
  state: GameState;
}

function TeamPanel({ state, teamId }: { state: GameState; teamId: TeamId }) {
  const team = state.teams[teamId];
  const isTurn = state.handTurn === teamId;
  const isGolden = state.goldenHand === teamId;

  return (
    <div
      className={`flex flex-1 flex-col items-center gap-2 rounded-3xl border px-4 py-5 transition ${
        isGolden
          ? "border-amber-400 bg-emerald-800/70 shadow-[0_0_0_2px_rgba(251,191,36,0.5)]"
          : "border-emerald-700/70 bg-emerald-900/40"
      }`}
    >
      <span className="max-w-full truncate text-sm font-semibold uppercase tracking-wide text-emerald-200">
        {team.name}
      </span>
      <span className="text-6xl font-black tabular-nums text-white">{state.scores[teamId]}</span>
      <div className="flex h-5 items-center gap-1 text-xs font-semibold text-amber-300">
        {isTurn && <span>● a mão</span>}
        {isGolden && <span>{VARIANT_RULES[state.variant].goldenHandLabel}</span>}
      </div>
    </div>
  );
}

export function ScoreBoard({ state }: ScoreBoardProps) {
  return (
    <div className="flex gap-3">
      <TeamPanel state={state} teamId="A" />
      <TeamPanel state={state} teamId="B" />
    </div>
  );
}
