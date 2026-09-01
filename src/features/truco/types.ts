export type GameMode = "dupla" | "individual";

export type Variant = "paulista" | "mineiro";

export type TeamId = "A" | "B";

export type HandValue = 1 | 3 | 6 | 9 | 12;

export interface TeamConfig {
  id: TeamId;
  name: string;
}

export type CallStatus = "none" | "pending";

export interface TrucoCall {
  status: CallStatus;
  /** Value being proposed while a call is pending. */
  value: HandValue;
  calledBy: TeamId | null;
  /** Whether the responding team is allowed to run away from this call. */
  canRun: boolean;
}

export interface HandRecord {
  handNumber: number;
  winner: TeamId | null;
  value: HandValue;
  ranAway: boolean;
}

export interface GameConfig {
  mode: GameMode;
  variant: Variant;
  teams: Record<TeamId, TeamConfig>;
}

export interface GameState extends GameConfig {
  scores: Record<TeamId, number>;
  handValue: HandValue;
  call: TrucoCall;
  /** Team that holds "a mão" (deals / plays last) this hand. */
  handTurn: TeamId;
  handNumber: number;
  /** Team playing a forced "mão de ouro" hand (mão de 11 / mão de 10), if any. */
  goldenHand: TeamId | null;
  winner: TeamId | null;
  history: HandRecord[];
}

export const MAX_SCORE = 12;
