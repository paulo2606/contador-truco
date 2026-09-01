import {
  acceptCall,
  callTruco,
  createInitialState,
  runFromCall,
  tieHand,
  winHand,
} from "./engine";
import { GameConfig } from "./types";

const baseConfig: GameConfig = {
  mode: "dupla",
  variant: "paulista",
  teams: { A: { id: "A", name: "Nós" }, B: { id: "B", name: "Eles" } },
};

describe("createInitialState", () => {
  it("starts scoreless with hand valuing 1 and team A holding a mão", () => {
    const state = createInitialState(baseConfig);
    expect(state.scores).toEqual({ A: 0, B: 0 });
    expect(state.handValue).toBe(1);
    expect(state.handTurn).toBe("A");
    expect(state.winner).toBeNull();
  });
});

describe("winHand", () => {
  it("awards the current hand value to the winning team", () => {
    let state = createInitialState(baseConfig);
    state = winHand(state, "A");
    expect(state.scores.A).toBe(1);
    expect(state.scores.B).toBe(0);
    expect(state.handNumber).toBe(2);
    expect(state.handTurn).toBe("B");
  });

  it("caps the score at 12 even when a truco hand would overshoot", () => {
    let state = createInitialState(baseConfig);
    state = { ...state, scores: { A: 10, B: 0 }, handValue: 9 };
    state = winHand(state, "A");
    expect(state.scores.A).toBe(12);
    expect(state.winner).toBe("A");
  });

  it("declares a winner once a team reaches 12", () => {
    let state = createInitialState(baseConfig);
    state = { ...state, scores: { A: 11, B: 0 }, handValue: 1 };
    state = winHand(state, "A");
    expect(state.scores.A).toBe(12);
    expect(state.winner).toBe("A");
  });

  it("does nothing while a call is pending", () => {
    let state = createInitialState(baseConfig);
    state = callTruco(state, "A");
    const before = state;
    state = winHand(state, "A");
    expect(state).toBe(before);
  });
});

describe("truco call flow", () => {
  it("raises the stake through the sequence 1 -> 3 -> 6 -> 9 -> 12", () => {
    let state = createInitialState(baseConfig);
    state = callTruco(state, "A");
    expect(state.call).toMatchObject({ status: "pending", value: 3, calledBy: "A" });

    state = acceptCall(state);
    expect(state.handValue).toBe(3);
    expect(state.call.status).toBe("none");

    state = callTruco(state, "B");
    expect(state.call).toMatchObject({ status: "pending", value: 6, calledBy: "B" });
    state = acceptCall(state);
    expect(state.handValue).toBe(6);
  });

  it("does not let the same team raise its own pending call", () => {
    let state = createInitialState(baseConfig);
    state = callTruco(state, "A");
    const escalated = callTruco(state, "A");
    expect(escalated).toBe(state);
  });

  it("stops raising past 12", () => {
    let state = createInitialState(baseConfig);
    state = { ...state, handValue: 12 };
    const escalated = callTruco(state, "A");
    expect(escalated).toBe(state);
  });

  it("awards the pre-raise value to the caller when the opponent runs away", () => {
    let state = createInitialState(baseConfig);
    state = { ...state, handValue: 3 };
    state = callTruco(state, "A");
    expect(state.call.value).toBe(6);
    state = runFromCall(state);
    expect(state.scores.A).toBe(3);
    expect(state.scores.B).toBe(0);
    expect(state.call.status).toBe("none");
  });
});

describe("mão de ouro (mão de 11 / mão de 10)", () => {
  it("forces the hand to start at 3 and disallows running away for the paulista mão de 11", () => {
    let state = createInitialState(baseConfig);
    state = { ...state, scores: { A: 11, B: 5 } };
    state = winHand(state, "B");
    expect(state.goldenHand).toBe("A");
    expect(state.handValue).toBe(3);

    state = callTruco(state, "B");
    expect(state.call.canRun).toBe(false);
    const before = state;
    state = runFromCall(state);
    expect(state).toBe(before);
  });

  it("triggers at 10 points for the mineiro variant", () => {
    let state = createInitialState({ ...baseConfig, variant: "mineiro" });
    state = { ...state, scores: { A: 10, B: 2 } };
    state = winHand(state, "B");
    expect(state.goldenHand).toBe("A");
    expect(state.handValue).toBe(3);
  });
});

describe("tieHand", () => {
  it("moves to the next hand without awarding points", () => {
    let state = createInitialState(baseConfig);
    state = tieHand(state);
    expect(state.scores).toEqual({ A: 0, B: 0 });
    expect(state.handNumber).toBe(2);
    expect(state.handTurn).toBe("B");
  });
});
