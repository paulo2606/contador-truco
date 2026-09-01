import { HAND_SEQUENCE, VARIANT_RULES, nextHandValue } from "./constants";
import { GameConfig, GameState, HandValue, MAX_SCORE, TeamId } from "./types";

export function otherTeam(team: TeamId): TeamId {
  return team === "A" ? "B" : "A";
}

function detectGoldenHand(state: Pick<GameState, "variant" | "scores">, handTurn: TeamId): TeamId | null {
  const threshold = VARIANT_RULES[state.variant].goldenHandScore;
  const other = otherTeam(handTurn);
  if (state.scores[handTurn] === threshold) return handTurn;
  if (state.scores[other] === threshold) return other;
  return null;
}

export function createInitialState(config: GameConfig): GameState {
  const handTurn: TeamId = "A";
  const scores = { A: 0, B: 0 };
  const goldenHand = detectGoldenHand({ variant: config.variant, scores }, handTurn);
  return {
    ...config,
    scores,
    handValue: goldenHand ? 3 : 1,
    call: { status: "none", value: 1, calledBy: null, canRun: true },
    handTurn,
    handNumber: 1,
    goldenHand,
    winner: null,
    history: [],
  };
}

/** One side calls or raises the truco stake. */
export function callTruco(state: GameState, callingTeam: TeamId): GameState {
  if (state.winner) return state;
  const baseValue = state.call.status === "pending" ? state.call.value : state.handValue;
  if (state.call.status === "pending" && state.call.calledBy === callingTeam) return state;
  const proposed = nextHandValue(baseValue);
  if (!proposed) return state;
  return {
    ...state,
    call: {
      status: "pending",
      value: proposed,
      calledBy: callingTeam,
      canRun: !state.goldenHand,
    },
  };
}

/** The team facing the call accepts the new stake; play continues. */
export function acceptCall(state: GameState): GameState {
  if (state.call.status !== "pending") return state;
  return {
    ...state,
    handValue: state.call.value,
    call: { status: "none", value: state.call.value, calledBy: null, canRun: true },
  };
}

function startNextHand(state: GameState): Pick<GameState, "handValue" | "call" | "handTurn" | "handNumber" | "goldenHand"> {
  const handTurn = otherTeam(state.handTurn);
  const goldenHand = detectGoldenHand(state, handTurn);
  return {
    handValue: goldenHand ? 3 : 1,
    call: { status: "none", value: 1, calledBy: null, canRun: true },
    handTurn,
    handNumber: state.handNumber + 1,
    goldenHand,
  };
}

function applyPoints(state: GameState, team: TeamId, points: HandValue): Pick<GameState, "scores" | "winner"> {
  const newScore = Math.min(MAX_SCORE, state.scores[team] + points);
  const scores = { ...state.scores, [team]: newScore };
  const winner = newScore >= MAX_SCORE ? team : null;
  return { scores, winner };
}

/** The team facing a call runs away; the caller wins the hand at its pre-raise value. */
export function runFromCall(state: GameState): GameState {
  if (state.call.status !== "pending" || !state.call.canRun || !state.call.calledBy) return state;
  const winner = state.call.calledBy;
  const points = state.handValue;
  const { scores, winner: gameWinner } = applyPoints(state, winner, points);
  const history = [...state.history, { handNumber: state.handNumber, winner, value: points, ranAway: true }];

  if (gameWinner) {
    return { ...state, scores, winner: gameWinner, history };
  }

  return { ...state, scores, history, ...startNextHand(state) };
}

/** A team wins the current hand outright (no pending call). */
export function winHand(state: GameState, winner: TeamId): GameState {
  if (state.call.status === "pending" || state.winner) return state;
  const points = state.handValue;
  const { scores, winner: gameWinner } = applyPoints(state, winner, points);
  const history = [...state.history, { handNumber: state.handNumber, winner, value: points, ranAway: false }];

  if (gameWinner) {
    return { ...state, scores, winner: gameWinner, history };
  }

  return { ...state, scores, history, ...startNextHand(state) };
}

/** The hand is tied ("empatou" / "mão de vazas"): no points, deal moves on. */
export function tieHand(state: GameState): GameState {
  if (state.call.status === "pending" || state.winner) return state;
  const history = [...state.history, { handNumber: state.handNumber, winner: null, value: state.handValue, ranAway: false }];
  return { ...state, history, ...startNextHand(state) };
}

export function resetScores(state: GameState): GameState {
  return createInitialState({ mode: state.mode, variant: state.variant, teams: state.teams });
}

export function canRaise(state: GameState): boolean {
  const baseValue = state.call.status === "pending" ? state.call.value : state.handValue;
  return nextHandValue(baseValue) !== null;
}

export const ALL_HAND_VALUES = HAND_SEQUENCE;
